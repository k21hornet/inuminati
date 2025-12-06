package com.chihuahuawashawasha.inuminati.user.dto;

import lombok.Data;

@Data
public class ProfileDto {

    private Long userId;

    private String userName;

    private String selfIntroduction;

    private String profileImageUrl;

    private String headerImageUrl;
}
