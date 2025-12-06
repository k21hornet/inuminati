package com.chihuahuawashawasha.inuminati.application.api.controller;

import com.chihuahuawashawasha.inuminati.application.api.mapper.ProfileResponseMapper;
import com.chihuahuawashawasha.inuminati.application.api.contract.response.ProfileResponse;
import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final ProfileService profileService;

    private final ProfileResponseMapper profileResponseMapper;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile() {
        // FIXME
        ProfileDto profileDto = profileService.findProfile(1L);
        return ResponseEntity.ok(profileResponseMapper.toResponse(profileDto));
    }
}
