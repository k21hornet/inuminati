package com.chihuahuawashawasha.inuminati.model.response;

import lombok.Data;

@Data
public class ProfileResponse {

    private String userId;

    private String userName;

    private String nickname;

    private String selfIntroduction;

    private String profileImageUrl;

    /**
     * 自身がこのユーザーにフォローされているか
     */
    private Boolean isFollowed;

    /**
     * 自身がこのユーザーをフォローしているか
     */
    private Boolean isFollowing;

    /**
     * ユーザーのフォロワー数
     */
    private Integer followerCount;

    /**
     * ユーザーがフォローしてるユーザー数
     */
    private Integer followingCount;
}
