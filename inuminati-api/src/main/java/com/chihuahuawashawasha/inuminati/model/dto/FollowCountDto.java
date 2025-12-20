package com.chihuahuawashawasha.inuminati.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowCountDto {

    /**
     * 対象ユーザーのフォロワー数
     */
    private Integer followerCount;

    /**
     * 対象ユーザーがフォローしてるユーザー数
     */
    private Integer followingCount;
}
