package com.chihuahuawashawasha.inuminati.repository;

import com.chihuahuawashawasha.inuminati.model.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLike.PostLikeId> {

    boolean existsByPostLikeId_PostIdAndPostLikeId_UserId(String postId, String userId);

    void deleteByPostLikeId_PostIdAndPostLikeId_UserId(String postId, String userId);
}
