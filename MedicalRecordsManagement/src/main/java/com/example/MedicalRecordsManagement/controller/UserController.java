package com.example.MedicalRecordsManagement.controller;


import com.example.MedicalRecordsManagement.dto.request.UserRequestDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping("/")
    public String AddUser(UserRequestDTO userRequestDTO) {
        return "User added successfully";
    }
}
