package com.chihuahuawashawasha.inuminati.application.api.contract.response;

import lombok.Data;

@Data
public class ProfileResponse {

    private Long userId;

    private String userName;

    private String selfIntroduction;

    private String profileImageUrl;

    private String headerImageUrl;
}
