package com.chihuahuawashawasha.inuminati.application.api.controller;

import com.chihuahuawashawasha.inuminati.application.api.mapper.ProfileResponseMapper;
import com.chihuahuawashawasha.inuminati.application.api.model.response.ProfileResponse;
import com.chihuahuawashawasha.inuminati.user.dto.FollowRelationshipDto;
import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.user.service.ProfileService;
import com.chihuahuawashawasha.inuminati.user.service.UserRelationshipService;
import com.chihuahuawashawasha.inuminati.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final ProfileService profileService;

    private final UserRelationshipService userRelationshipService;

    private final ProfileResponseMapper profileResponseMapper;

    @GetMapping("/{userName}")
    public ResponseEntity<ProfileResponse> getProfile(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String userName
    ) {
        ProfileDto profileDto = profileService.findProfileByUserName(userName);

        // フォロー関係を取得
        String followerUserId = userService.findUserId(jwt.getClaimAsString("http://claim/email"));
        String followingUserId = userService.findUserIdByUserName(userName);
        FollowRelationshipDto followRelationship = userRelationshipService.findFollowRelationship(followerUserId, followingUserId);
        Boolean isFollowed = followRelationship.getIsFollowed();
        Boolean isFollowing = followRelationship.getIsFollowing();
        return ResponseEntity.ok(profileResponseMapper.toResponse(profileDto, isFollowed, isFollowing));
    }

    @PostMapping("/{followingUserName}/follow")
    public ResponseEntity<Void> follow(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String followingUserName
    ) {
        String followerUserId = userService.findUserId(jwt.getClaimAsString("http://claim/email"));
        String followingUserId = userService.findUserIdByUserName(followingUserName);

        userRelationshipService.handleFollow(followerUserId, followingUserId);
        return ResponseEntity.ok().build();
    }
}
