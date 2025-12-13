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
}
