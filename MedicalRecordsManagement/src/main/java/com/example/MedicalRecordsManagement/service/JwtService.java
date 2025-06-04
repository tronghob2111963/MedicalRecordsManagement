package com.example.MedicalRecordsManagement.service;

import com.example.MedicalRecordsManagement.common.TokenType;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

public interface JwtService {
    String generateAccessToken(long userId, String username, Collection<? extends GrantedAuthority> authorities);
    String generateRefreshToken(long userId, String username, Collection<? extends GrantedAuthority> authorities);


    String extractUsername(String token,  TokenType tokenType);


}
