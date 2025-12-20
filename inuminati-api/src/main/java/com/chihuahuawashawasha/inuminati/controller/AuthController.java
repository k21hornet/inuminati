package com.chihuahuawashawasha.inuminati.controller;

import com.chihuahuawashawasha.inuminati.model.request.SignupRequest;
import com.chihuahuawashawasha.inuminati.model.response.UserNameResponse;
import com.chihuahuawashawasha.inuminati.service.UserService;
import jakarta.validation.Valid;
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
    public ResponseEntity<Void> signup(@Valid @RequestBody SignupRequest request) {
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
