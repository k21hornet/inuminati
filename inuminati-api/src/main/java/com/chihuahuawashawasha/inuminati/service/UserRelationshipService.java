package com.chihuahuawashawasha.inuminati.service;

import com.chihuahuawashawasha.inuminati.exception.UserRelationshipException;
import com.chihuahuawashawasha.inuminati.model.dto.FollowCountDto;
import com.chihuahuawashawasha.inuminati.model.dto.FollowRelationshipDto;
import com.chihuahuawashawasha.inuminati.model.entity.Follow;
import com.chihuahuawashawasha.inuminati.repository.FollowRepository;
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
     * @param currentUserId 現在のユーザー
     * @param targetUserId フォロー対象ユーザー
     */
    public void handleFollow(String currentUserId, String targetUserId) {
        // 自己フォローチェック
        if (currentUserId.equals(targetUserId)) {
            throw new UserRelationshipException("自分自身をフォローすることはできません");
        }

        // すでにフォロー済みならフォロー解除
        if (followRepository
                .existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(currentUserId,targetUserId)) {
            followRepository
                    .deleteByFollowId_FollowerUserIdAndFollowId_FollowingUserId(currentUserId,targetUserId);
            return;
        }

        Follow follow = new Follow();
        Follow.FollowId id = new Follow.FollowId();
        id.setFollowerUserId(currentUserId);
        id.setFollowingUserId(targetUserId);
        follow.setFollowId(id);
        followRepository.save(follow);
    }

    /**
     * ユーザーとのフォロー関係を取得
     * @param currentUserId ユーザー自身
     * @param targetUserId 対象ユーザー
     * @return FollowRelationshipDto
     */
    public FollowRelationshipDto findFollowRelationship(String currentUserId, String targetUserId) {
        // 対象ユーザーにフォローされているか
        Boolean isFollowed = followRepository
                .existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(targetUserId,currentUserId);
        // 対象ユーザーをフォローしているか
        Boolean isFollowing = followRepository
            .existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(currentUserId,targetUserId);
        return FollowRelationshipDto.builder()
                .isFollowed(isFollowed)
                .isFollowing(isFollowing)
                .build();
    }

    /**
     * ユーザーのフォロー数を取得
     * @param userId 対象ユーザー
     * @return フォロワー数、フォロー中ユーザー数
     */
    public FollowCountDto calcFollowCount(String userId) {
        int followerCount = followRepository.calcFollowerCount(userId);
        int followingCount = followRepository.calcFollowingCount(userId);
        return FollowCountDto.builder()
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build();
    }
}
