package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.common.TokenType;
import com.example.MedicalRecordsManagement.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoder;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static com.example.MedicalRecordsManagement.common.TokenType.ACCESS_TOKEN;
import static com.example.MedicalRecordsManagement.common.TokenType.REFRESH_TOKEN;


@Service
@Slf4j(topic = "JWT_SERVICE")
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.expriMinutes}")
    private long expriMinutes;


    @Value("${jwt.accesskey}")
    private String accesskey;

    @Value("${jwt.refreshkey}")
    private String refreshkey;

    @Value("${jwt.expireDate}")
    private long expriDate;

    @Override
    public String generateAccessToken(long userId, String username, Collection<? extends GrantedAuthority> authorities) {
        log.info("Generating access token for user: {}", username, authorities);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("role", authorities);

        return generateToken(claims, username);
    }

    @Override
    public String generateRefreshToken(long userId, String username, Collection<? extends GrantedAuthority> authorities) {
        log.info("Generating refresh token for user: {}", username, authorities);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("role", authorities);
        return generateToken(claims, username);
    }

    @Override
    public String extractUsername(String token, TokenType tokenType) {
        log.info("Extracting username from token: {}, type: {}", token, tokenType);
        return extractClaim(tokenType, token, Claims::getSubject);
    }

    private <T> T extractClaim(TokenType type, String token, Function<Claims, T> claimsExtractor) {
        log.info("Extracting claims from token: {}, type: {}", token, type);
        final Claims claims = extractAllClaim(token, type);


        return claimsExtractor.apply(claims);


    }

    private Claims extractAllClaim(String token, TokenType type)  {
        try {
            return Jwts.parser()
                    .setSigningKey(getSecretKey(type))
                    .parseClaimsJws(token)
                    .getBody();
        }catch (SignatureException | ExpiredJwtException  e) {
            throw new AccessDeniedException("Access denied!!! error " + e.getMessage());
        }
    }

    private String generateToken(Map<String, Object> claims, String username ) {
        log.info("Generating token for user: {}", username);
        // Here you would typically use a JWT library to create the token
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new java.util.Date(System.currentTimeMillis()))
                .setExpiration(new java.util.Date(System.currentTimeMillis() + 1000 * 60 * expriMinutes))
                .signWith(getSecretKey(ACCESS_TOKEN), SignatureAlgorithm.HS256)// Set expiration time
                .compact();
    }

    private String generateRefreshToken(Map<String, Object> claims, String username ) {
        log.info("Generating token for user: {}", username);
        // Here you would typically use a JWT library to create the token
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new java.util.Date(System.currentTimeMillis()))
                .setExpiration(new java.util.Date(System.currentTimeMillis() + 1000 * 60 * 24* expriDate))
                .signWith(getSecretKey(REFRESH_TOKEN), SignatureAlgorithm.HS256)// Set expiration time
                .compact();
    }

    private Key getSecretKey(TokenType type) {
        log.info("Retrieving secret key for JWT signing");
        switch (type) {
            case ACCESS_TOKEN -> {
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode("2mfGKBhdCa0K8X2uV1Fzn9o6sR8V0s5GUelGlxsFQAc="));
                // Replace with actual key retrieval logic
            }
            case REFRESH_TOKEN -> {
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode("/AqIfLpfbWqy36D3VBmkskYtmnpsJrLpRx00WVRnJlE="));
                // Replace with actual key retrieval logic
            }
            default -> throw new IllegalArgumentException("Invalid token type: " + type);
        }
         // Replace with actual key retrieval logic
    }
}
