package com.chihuahuawashawasha.inuminati.post.repository;

import com.chihuahuawashawasha.inuminati.post.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLike.PostLikeId> {

    boolean existsByPostLikeId_PostIdAndPostLikeId_UserId(String postId, String userId);

    void deleteByPostLikeId_PostIdAndPostLikeId_UserId(String postId, String userId);
}
