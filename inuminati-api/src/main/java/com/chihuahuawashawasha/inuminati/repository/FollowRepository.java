package com.chihuahuawashawasha.inuminati.repository;

import com.chihuahuawashawasha.inuminati.model.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FollowRepository extends JpaRepository<Follow, Follow.FollowId> {

    boolean existsByFollowId_FollowerUserIdAndFollowId_FollowingUserId(String followerUserId, String followingUserId);

    // フォローを解除する
    void deleteByFollowId_FollowerUserIdAndFollowId_FollowingUserId(String followerUserId, String followingUserId);

    /**
     * ユーザーのフォロワー数を取得（このユーザーをフォローしているユーザー数）
     * @param targetUserId 対象ユーザー
     * @return フォロワー数
     */
    @Query("""
            SELECT
                COUNT(f)
            FROM
                Follow f
            WHERE
                f.followId.followingUserId = :targetUserId
            """)
    Integer calcFollowerCount(String targetUserId);

    /**
     * ユーザーがフォローしているユーザー数を取得
     * @param targetUserId 対象ユーザー
     * @return フォロー中ユーザー数
     */
    @Query("""
            SELECT
                COUNT(f)
            FROM
                Follow f
            WHERE
                f.followId.followerUserId = :targetUserId
            """)
    Integer calcFollowingCount(String targetUserId);
}
