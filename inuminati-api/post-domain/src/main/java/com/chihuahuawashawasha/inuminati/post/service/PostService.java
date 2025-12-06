package com.chihuahuawashawasha.inuminati.post.service;

import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.post.entity.Post;
import com.chihuahuawashawasha.inuminati.post.mapper.PostMapper;
import com.chihuahuawashawasha.inuminati.post.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    private final PostMapper postMapper;

    public PostDto findPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("投稿が見つかりません。post_id: " + postId));
        return postMapper.toDto(post);
    }
}
