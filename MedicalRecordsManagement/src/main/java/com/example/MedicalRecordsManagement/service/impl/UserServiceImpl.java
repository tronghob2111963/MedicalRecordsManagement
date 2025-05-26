package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.dto.request.UserCreationRequest;
import com.example.MedicalRecordsManagement.dto.request.UserPasswordRequest;
import com.example.MedicalRecordsManagement.dto.response.UserResponse;
import com.example.MedicalRecordsManagement.entity.User;
import com.example.MedicalRecordsManagement.repository.UserRepository;
import com.example.MedicalRecordsManagement.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j(topic = "USER_SERVICE")
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse findAll(String keyword, String sort, int page, int size) {
        return null;
    }

    @Override
    public UserResponse findById(Long id) {
        return null;
    }

    @Override
    public UserResponse findByUsername(String username) {
        return null;
    }

    @Override
    public UserResponse findByEmail(String email) {
        return null;
    }

    @Override
    public long save(UserCreationRequest req) {
        log.info("Saving user with username: {}", req.getUsername());

        User userByUsername = userRepository.findByUsername(req.getUsername());
        if (userByUsername != null) {
            log.error("User with username {} already exists", req.getUsername());
            throw new IllegalArgumentException("User with this username already exists");
        }
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setDoctor_id(req.getDoctor_id());
        user.setRole(req.getRole());
        userRepository.save(user);

        log.info("User with username {} saved successfully", req.getUsername());

        return user.getId();
    }

    @Override
    public void update(UserCreationRequest req) {

    }

    @Override
    public void changePassword(UserPasswordRequest req) {

    }

    @Override
    public void delete(Long id) {

    }
}
