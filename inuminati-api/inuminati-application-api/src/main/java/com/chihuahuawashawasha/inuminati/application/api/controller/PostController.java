package com.chihuahuawashawasha.inuminati.application.api.controller;

import com.chihuahuawashawasha.inuminati.application.api.model.request.PostRequest;
import com.chihuahuawashawasha.inuminati.application.api.model.response.PostResponse;
import com.chihuahuawashawasha.inuminati.application.api.model.response.PostsResponse;
import com.chihuahuawashawasha.inuminati.application.api.mapper.PostRequestMapper;
import com.chihuahuawashawasha.inuminati.application.api.mapper.PostResponseMapper;
import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.post.service.PostService;
import com.chihuahuawashawasha.inuminati.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    private final ProfileService profileService;

    private final PostResponseMapper postResponseMapper;

    private final PostRequestMapper postRequestMapper;

    @GetMapping
    public ResponseEntity<PostsResponse> getPosts(@RequestParam(required = false) String userId) {
        List<PostResponse> posts = (userId != null
                ? postService.findAllByUserId(userId)
                : postService.findAll())
                .stream()
                .map(postResponseMapper::toResponse)
                .toList();
        return ResponseEntity.ok(PostsResponse.builder().posts(posts).build());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable String postId) {

        return ResponseEntity.ok(postResponseMapper.toResponse(postService.findPost(postId)));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Validated @RequestBody PostRequest request) {
        // ユーザーIDのチェック FIXME 運用を考える
        profileService.findProfile(request.getUserId());

        PostDto createPostDto = postService.createPost(postRequestMapper.toDto(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(postResponseMapper.toResponse(createPostDto));
    }
}
