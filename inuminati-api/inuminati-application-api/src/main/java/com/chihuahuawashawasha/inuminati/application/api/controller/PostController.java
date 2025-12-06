package com.chihuahuawashawasha.inuminati.application.api.controller;

import com.chihuahuawashawasha.inuminati.application.api.contract.response.PostResponse;
import com.chihuahuawashawasha.inuminati.application.api.mapper.PostResponseMapper;
import com.chihuahuawashawasha.inuminati.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    private final PostResponseMapper postResponseMapper;

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long postId) {

        return ResponseEntity.ok(postResponseMapper.toResponse(postService.findPost(postId)));
    }
}
