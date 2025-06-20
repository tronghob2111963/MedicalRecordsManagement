package com.example.MedicalRecordsManagement.service;

import com.example.MedicalRecordsManagement.dto.request.UserCreationRequest;
import com.example.MedicalRecordsManagement.dto.request.UserPasswordRequest;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.UserResponseDTO;

public interface UserService {
    PageResponse<?> getAllUser(int pageNo, int pageSize, String sortBy);


    UserResponseDTO findByUsername(String username);


    long save(UserCreationRequest req);

    UserResponseDTO updateUser(Long id, UserCreationRequest req);

    void delete(Long id);
}
