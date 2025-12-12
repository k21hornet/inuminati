package com.chihuahuawashawasha.inuminati.post.service;

import com.chihuahuawashawasha.inuminati.post.dto.PostRequestDto;
import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.post.entity.Post;
import com.chihuahuawashawasha.inuminati.post.entity.PostImage;
import com.chihuahuawashawasha.inuminati.post.mapper.PostMapper;
import com.chihuahuawashawasha.inuminati.post.repository.PostRepository;
import com.chihuahuawashawasha.inuminati.util.ShortIdGenerator;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    private final PostMapper postMapper;

    /**
     * 全ての投稿を取得する
     * @return 投稿一覧
     */
    public List<PostDto> findAll() {
        return postRepository.findAll().stream()
                .map(postMapper::toDto)
                .toList();
    }

    /**
     * ユーザーの全ての投稿を取得する
     * @return 投稿一覧
     */
    public List<PostDto> findAllByUserId(String userId) {
        return postRepository.findAllByUserId(userId).stream()
                .map(postMapper::toDto)
                .toList();
    }

    /**
     * 投稿を一件取得する
     * @param postId 投稿ID
     * @return 投稿
     */
    public PostDto findPost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("投稿が見つかりません。post_id: " + postId));
        return postMapper.toDto(post);
    }

    /**
     * 投稿作成
     * @param postRequestDto リクエスト
     * @return 投稿
     */
    public PostDto createPost(String userId, PostRequestDto postRequestDto) {
        if (postRequestDto.getImages() == null || postRequestDto.getImages().isEmpty()) {
            throw new RuntimeException("画像は1枚以上必要です");
        }

        Post post = new Post();
        post.setPostId(ShortIdGenerator.generateShortId());
        post.setUserId(userId);
        post.setContent(postRequestDto.getContent());

        List<PostImage> postImages = postRequestDto.getImages().stream()
                .map(postImageDto -> {
                    PostImage postImage = new PostImage();
                    postImage.setImageUrl(postImageDto.getImageUrl());
                    postImage.setImageOrder(postImageDto.getImageOrder());
                    postImage.setPost(post); // 双方向関係の設定
                    return postImage;
                }).toList();
        post.setPostImages(postImages);

        Post savedPost = postRepository.save(post);
        return postMapper.toDto(savedPost);
    }
}
