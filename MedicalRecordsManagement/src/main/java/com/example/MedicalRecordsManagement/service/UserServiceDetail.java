package com.example.MedicalRecordsManagement.service;


import com.example.MedicalRecordsManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceDetail {
    private final UserRepository userRepository;
    public UserDetailsService UserServiceDetail() {
           // Constructor
        return userRepository::findByUsername;
    }
}
