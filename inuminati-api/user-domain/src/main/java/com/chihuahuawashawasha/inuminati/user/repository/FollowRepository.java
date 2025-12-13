package com.chihuahuawashawasha.inuminati.user.repository;

import com.chihuahuawashawasha.inuminati.user.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Follow.FollowId> {

    boolean existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(String followerUserId, String followingUserId);

    // フォローを解除する
    void deleteByFollowId_FollowerUserIdAndFollowId_FollowingUserId(String followerUserId, String followingUserId);
}
