package com.example.MedicalRecordsManagement.controller;


import com.example.MedicalRecordsManagement.dto.request.SignInRequest;
import com.example.MedicalRecordsManagement.dto.response.TokenResponse;
import com.example.MedicalRecordsManagement.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication")
@Slf4j(topic = "AUTH_CONTROLLER")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;


    @Operation(summary = "Access Token")
    @PostMapping("/access-token")
    public TokenResponse AccessToken(@RequestBody SignInRequest signInRequest) {
        log.info("Access Token Endpoint Hit");
//        return TokenResponse.builder().AccessToken("DUMMY-AccessToken").RefreshToken("DUMMY-RefreshToken").build();
        return authenticationService.getAccessToken(signInRequest);
        // TO DO : Add your logic here
    }


    @Operation(summary = "Refresh Token")
    @PostMapping("/refresh-token")
    public TokenResponse RefreshToken(@RequestBody String refreshToken) {
        log.info("Refresh Token Endpoint Hit");
        return TokenResponse.builder().AccessToken("NEW-DUMMY-AccessToken").RefreshToken("DUMMY-RefreshToken").build();
        // TO DO : Add your logic here
    }
}
