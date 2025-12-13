package com.chihuahuawashawasha.inuminati.user.dto;

import lombok.Data;

@Data
public class ProfileDto {

    private String userId;

    private String userName;

    private String nickname;

    private String selfIntroduction;

    private String profileImageUrl;
}
