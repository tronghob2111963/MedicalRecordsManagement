package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.common.UserRole;
import com.example.MedicalRecordsManagement.dto.request.SignInRequest;
import com.example.MedicalRecordsManagement.dto.response.TokenResponse;
import com.example.MedicalRecordsManagement.entity.User;
import com.example.MedicalRecordsManagement.exception.InvalidDataException;
import com.example.MedicalRecordsManagement.repository.UserRepository;
import com.example.MedicalRecordsManagement.service.AuthenticationService;
import com.example.MedicalRecordsManagement.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

import static com.example.MedicalRecordsManagement.common.TokenType.REFRESH_TOKEN;


@Service
@Slf4j(topic = "AUTHENTICATION_SERVICE")
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    @Override
    public TokenResponse getAccessToken(SignInRequest request) {
        log.info("Getting access token for user: {}", request.getUsername());

        try {
            // Thực hiện xác thực với username và password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Nếu xác thực thành công, lưu thông tin vào SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            log.error("Error authenticating user: {}", e.getMessage());
            throw new AccessDeniedException("Invalid username or password");
        }

        var user = userRepository.findByUsername(request.getUsername());


        String accessToken = jwtService.generateAccessToken(user.getId(), request.getUsername(), null);
        String refreshToken = jwtService.generateRefreshToken(user.getId(), request.getUsername(), null);
        UserRole userRole = user.getRole();

        log.info("Generated access token: {}", accessToken);

        return TokenResponse.builder()
                .AccessToken(accessToken)
                .RefreshToken(refreshToken)
                .username(request.getUsername())
                .role(userRole)
                .doctorId(user.getDoctorId())
                .build();
    }

    @Override
    public TokenResponse getRefreshToken(String refreshToken) {
        return null;
    }
}
