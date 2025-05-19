package com.example.MedicalRecordsManagement.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UserRequestDTO {




}



//CREATE TABLE Users (
//        UserID INT PRIMARY KEY AUTO_INCREMENT,
//        Username VARCHAR(50) UNIQUE NOT NULL,
//Password VARCHAR(255) NOT NULL, -- Lưu mật khẩu mã hóa (bcrypt)
//Role NVARCHAR(20) NOT NULL, -- Admin, Doctor, Patient
//RelatedID INT, -- Liên kết đến PatientID hoặc DoctorID
//CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//);




