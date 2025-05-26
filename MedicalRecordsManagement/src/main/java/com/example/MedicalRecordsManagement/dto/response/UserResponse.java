package com.example.MedicalRecordsManagement.dto.response;

public class UserResponse {
    private String username;
    private String password;
    private String role;

}

//ID INT PRIMARY KEY AUTO_INCREMENT,
//username VARCHAR(50) UNIQUE NOT NULL,
//password VARCHAR(255) NOT NULL, -- Lưu mật khẩu mã hóa (bcrypt)
//role ENUM('DOCTOR', 'ADMIN') DEFAULT 'ADMIN'
