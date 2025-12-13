package com.chihuahuawashawasha.inuminati.application.api.controller;

import com.chihuahuawashawasha.inuminati.application.api.model.request.PostRequest;
import com.chihuahuawashawasha.inuminati.application.api.model.response.PostDetailResponse;
import com.chihuahuawashawasha.inuminati.application.api.model.response.PostResponse;
import com.chihuahuawashawasha.inuminati.application.api.model.response.PostsResponse;
import com.chihuahuawashawasha.inuminati.application.api.mapper.PostRequestMapper;
import com.chihuahuawashawasha.inuminati.application.api.mapper.PostResponseMapper;
import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.post.service.PostService;
import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.user.service.ProfileService;
import com.chihuahuawashawasha.inuminati.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    private final ProfileService profileService;

    private final UserService userService;

    private final PostResponseMapper postResponseMapper;

    private final PostRequestMapper postRequestMapper;

    @GetMapping
    public ResponseEntity<PostsResponse> getPosts(@RequestParam(required = false) String userName) {
        List<PostResponse> posts;
        if (userName != null) {
            String userId = userService.findUserIdByUserName(userName);
            posts = postService.findAllByUserId(userId)
                    .stream()
                    .map(postResponseMapper::toResponse)
                    .toList();
        } else {
            posts = postService.findAll()
                    .stream()
                    .map(postResponseMapper::toResponse)
                    .toList();
        }
        return ResponseEntity.ok(PostsResponse.builder().posts(posts).build());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponse> getPost(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String postId
    ) {
        PostDto postDto = postService.findPost(postId);
        ProfileDto profileDto = profileService.findProfileByUserId(postDto.getUserId());

        // ユーザーがいいね済みかどうか判定
        String userId = userService.findUserId(jwt.getClaimAsString("http://claim/email"));
        Boolean isLiked = postService.isLikedByUser(userId, postId);

        return ResponseEntity.ok(postResponseMapper.toResponse(postDto, profileDto, isLiked));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @AuthenticationPrincipal Jwt jwt,
            @Validated @RequestBody PostRequest request
    ) {
        String userId = userService.findUserId(jwt.getClaimAsString("http://claim/email"));

        PostDto createPostDto = postService.createPost(userId, postRequestMapper.toDto(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(postResponseMapper.toResponse(createPostDto));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String postId) {
        String userId = userService.findUserId(jwt.getClaimAsString("http://claim/email"));

        postService.likePost(userId, postId);
        return ResponseEntity.noContent().build();
    }
}
