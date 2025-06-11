package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.dto.request.UserCreationRequest;
import com.example.MedicalRecordsManagement.dto.request.UserPasswordRequest;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.UserResponseDTO;
import com.example.MedicalRecordsManagement.entity.User;
import com.example.MedicalRecordsManagement.repository.UserRepository;
import com.example.MedicalRecordsManagement.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@RequiredArgsConstructor
@Slf4j(topic = "USER_SERVICE")
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResponse<?> getAllUser(int pageNo, int pageSize, String sortBy) {
        int p = pageNo > 0 ? pageNo - 1 : 0;
        List<Sort.Order> sorts = new ArrayList<>();
        // Sort by ID
        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
            Matcher matcher = pattern.matcher(sortBy);
            if (matcher.find()) {
                if (matcher.group(3).equalsIgnoreCase("asc")) {
                    sorts.add(new Sort.Order(Sort.Direction.ASC, matcher.group(1)));
                } else {
                    sorts.add(new Sort.Order(Sort.Direction.DESC, matcher.group(1)));
                }
            }
        }
        Pageable pageable = PageRequest.of(p, pageSize, Sort.by(sorts));
        Page<User> users = userRepository.findAll(pageable);
        List<UserResponseDTO> userResponses = users.stream().map(user -> UserResponseDTO.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .role(String.valueOf(user.getRole()))
                .build()).toList();
        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .items(userResponses)
                .build();
    }


    @Override
    public UserResponseDTO findByUsername(String username) {
        log.info("Finding user with username: {}", username);
        User user = userRepository.findByUsername(username);
        if(user == null) {
            throw new IllegalArgumentException("User not found");
        }
       return UserResponseDTO.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .role(String.valueOf(user.getRole()))
                .build();
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
    public UserResponseDTO updateUer(Long id, UserCreationRequest req) {
        log.info("Updating user with id: {}", id);
        User user = userRepository.findById(Math.toIntExact(id)).orElse(null);
        if (user == null) {
            log.error("User with id {} not found", id);
            throw new IllegalArgumentException("User not found");
        }
        user.setPassword(req.getPassword());
        user.setRole(req.getRole());
        userRepository.save(user);
        log.info("User with id {} updated successfully", id);
        return UserResponseDTO.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .role(String.valueOf(user.getRole()))
                .build();
    }

    @Override
    public void changePassword(UserPasswordRequest req) {

    }

    @Override
    public void delete(Long id) {
        log.info("Deleting user with id: {}", id);
        User user = userRepository.findById(Math.toIntExact(id)).orElse(null);
        if (user == null) {
            log.error("User with id {} not found", id);
            throw new IllegalArgumentException("User not found");
        }
        userRepository.delete(user);
        log.info("User with id {} deleted successfully", id);
    }
}
