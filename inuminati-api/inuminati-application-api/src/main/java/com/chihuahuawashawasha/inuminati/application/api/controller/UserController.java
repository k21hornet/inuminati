package com.chihuahuawashawasha.inuminati.application.api.controller;

import com.chihuahuawashawasha.inuminati.application.api.mapper.ProfileResponseMapper;
import com.chihuahuawashawasha.inuminati.application.api.model.response.ProfileResponse;
import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final ProfileService profileService;

    private final ProfileResponseMapper profileResponseMapper;

    @GetMapping("/{userName}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable String userName) {
        ProfileDto profileDto = profileService.findProfileByUserName(userName);
        return ResponseEntity.ok(profileResponseMapper.toResponse(profileDto));
    }
}
