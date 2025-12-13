package com.chihuahuawashawasha.inuminati.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowRelationshipDto {

    /**
     * フォローされているか
     */
    Boolean isFollowed;

    /**
     * フォローしているか
     */
    Boolean isFollowing;
}
