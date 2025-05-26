package com.example.MedicalRecordsManagement.service;


import com.example.MedicalRecordsManagement.dto.request.SignInRequest;
import com.example.MedicalRecordsManagement.dto.response.TokenResponse;

public interface AuthenticationService {
    TokenResponse getAccessToken(SignInRequest request);

    TokenResponse getRefreshToken(String request);



}
