package com.example.MedicalRecordsManagement.service;

import com.example.MedicalRecordsManagement.dto.request.UserCreationRequest;
import com.example.MedicalRecordsManagement.dto.request.UserPasswordRequest;
import com.example.MedicalRecordsManagement.dto.response.UserResponse;

public interface UserService {
    UserResponse findAll(String keyword, String sort, int page, int size);

    UserResponse findById(Long id);

    UserResponse findByUsername(String username);

    UserResponse findByEmail(String email);

    long save(UserCreationRequest req);

    void update(UserCreationRequest req);

    void changePassword(UserPasswordRequest req);

    void delete(Long id);
}
