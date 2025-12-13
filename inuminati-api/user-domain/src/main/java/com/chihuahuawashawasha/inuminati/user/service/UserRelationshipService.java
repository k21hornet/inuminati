package com.chihuahuawashawasha.inuminati.user.service;

import com.chihuahuawashawasha.inuminati.exception.UserRelationshipException;
import com.chihuahuawashawasha.inuminati.user.dto.FollowRelationshipDto;
import com.chihuahuawashawasha.inuminati.user.entity.Follow;
import com.chihuahuawashawasha.inuminati.user.repository.FollowRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserRelationshipService {

    private final FollowRepository followRepository;

    /**
     * フォロー・フォロー解除を取り扱う
     * @param followerUserId フォローする人
     * @param followingUserId フォローされる人
     */
    public void handleFollow(String followerUserId, String followingUserId) {
        // すでにフォロー済みならフォロー解除
        if (followRepository
                .existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(followerUserId,followingUserId)) {
            followRepository
                    .deleteByFollowId_FollowerUserIdAndFollowId_FollowingUserId(followerUserId,followingUserId);
            return;
        }

        if (followerUserId.equals(followingUserId)) {
            throw new UserRelationshipException("自分自身をフォローすることはできません");
        }

        Follow follow = new Follow();
        Follow.FollowId id = new Follow.FollowId();
        id.setFollowerUserId(followerUserId);
        id.setFollowingUserId(followingUserId);
        follow.setFollowId(id);
        followRepository.save(follow);
    }

    /**
     * ユーザーとのフォロー関係を取得
     * @param actorUserId ユーザー自身
     * @param targetUserId 対象ユーザー
     * @return FollowRelationshipDto
     */
    public FollowRelationshipDto findFollowRelationship(String actorUserId, String targetUserId) {
        // 対象ユーザーにフォローされているか
        Boolean isFollowed = followRepository
                .existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(targetUserId,actorUserId);
        // 対象ユーザーをフォローしているか
        Boolean isFollowing = followRepository
            .existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(actorUserId,targetUserId);
        return FollowRelationshipDto.builder()
                .isFollowed(isFollowed)
                .isFollowing(isFollowing)
                .build();
    }
}
