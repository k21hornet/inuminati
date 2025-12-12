package com.chihuahuawashawasha.inuminati.application.api.controller;

import com.chihuahuawashawasha.inuminati.application.api.model.request.SignupRequest;
import com.chihuahuawashawasha.inuminati.application.api.model.response.UserNameResponse;
import com.chihuahuawashawasha.inuminati.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody SignupRequest request, @AuthenticationPrincipal Jwt jwt) {
        String email = request.getEmail();
        userService.createUserIfNotExist(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserNameResponse> me(@AuthenticationPrincipal Jwt jwt) {
        String userName = userService.findUserName(jwt.getClaimAsString("http://claim/email"));
        return ResponseEntity.ok(UserNameResponse.builder().userName(userName).build());
    }
}
