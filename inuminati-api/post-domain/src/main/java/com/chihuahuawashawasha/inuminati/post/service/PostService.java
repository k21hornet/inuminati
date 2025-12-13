package com.chihuahuawashawasha.inuminati.post.service;

import com.chihuahuawashawasha.inuminati.post.dto.PostRequestDto;
import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.post.entity.Post;
import com.chihuahuawashawasha.inuminati.post.entity.PostImage;
import com.chihuahuawashawasha.inuminati.post.entity.PostLike;
import com.chihuahuawashawasha.inuminati.post.mapper.PostMapper;
import com.chihuahuawashawasha.inuminati.post.repository.PostLikeRepository;
import com.chihuahuawashawasha.inuminati.post.repository.PostRepository;
import com.chihuahuawashawasha.inuminati.util.ShortIdGenerator;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    private final PostLikeRepository postLikeRepository;

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

    /**
     * いいね
     * @param userId ユーザーID
     * @param postId 投稿ID
     */
    public void likePost(String userId, String postId) {
        // 既にいいねが存在すれば取り消す
        if (postLikeRepository.existsByPostLikeId_PostIdAndPostLikeId_UserId(postId, userId)) {
            postLikeRepository.deleteByPostLikeId_PostIdAndPostLikeId_UserId(postId, userId);
            return;
        }

        PostLike postLike = new PostLike();
        PostLike.PostLikeId id = new PostLike.PostLikeId();
        id.setUserId(userId);
        id.setPostId(postId);
        postLike.setPostLikeId(id);
        postLikeRepository.save(postLike);
    }

    /**
     * いいね済みかどうか判定
     * @param userId ユーザーID
     * @param postId 投稿ID
     * @return いいね済みかどうか
     */
    public boolean isLikedByUser(String userId, String postId) {
        return postLikeRepository.existsByPostLikeId_PostIdAndPostLikeId_UserId(postId, userId);
    }
}
