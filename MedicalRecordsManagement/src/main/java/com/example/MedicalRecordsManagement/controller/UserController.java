package com.example.MedicalRecordsManagement.controller;


import com.example.MedicalRecordsManagement.dto.request.UserCreationRequest;
import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.dto.response.UserResponseDTO;
import com.example.MedicalRecordsManagement.entity.User;
import com.example.MedicalRecordsManagement.repository.UserRepository;
import com.example.MedicalRecordsManagement.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Tag(name = "User Controller")
@Slf4j(topic = "USER-CONTROLLER")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Operation(summary = "Create User")
    @PostMapping("/create")
    public ResponseEntity<Object> createUser(@RequestBody @Valid UserCreationRequest request ) {
        log.info("Creating user with username: {}", request.getUsername());
        try {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", HttpStatus.CREATED.value());
            result.put("message", "User created successfully");
            result.put("data", userService.save(request));

            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    @GetMapping("/get-all-users")
    @Operation(summary = "Get all users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<?> getAllUsers(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "ID:asc") String sortBy
    ) {
        log.info("Fetching all users with pageNo: {}, pageSize: {}, sortBy: {}", pageNo, pageSize, sortBy);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    userService.getAllUser(pageNo, pageSize, sortBy));
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching users: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update user")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody @Valid UserCreationRequest request) {
        log.info("Updating user with id: {}", id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    userService.updateUer(id, request));
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating user: " + e.getMessage());
        }
    }

    @GetMapping("/get-user/{id}")
    @Operation(summary = "Get user by id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        log.info("Fetching user with id: {}", id);
        try {
            return new ResponseEntity<>(userRepository.findById(Math.toIntExact(id)).orElse(null), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching user: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
