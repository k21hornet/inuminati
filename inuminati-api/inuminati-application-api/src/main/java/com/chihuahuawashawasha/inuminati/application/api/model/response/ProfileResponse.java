package com.chihuahuawashawasha.inuminati.application.api.model.response;

import lombok.Data;

@Data
public class ProfileResponse {

    private String userId;

    private String userName;

    private String selfIntroduction;

    private String profileImageUrl;
}
