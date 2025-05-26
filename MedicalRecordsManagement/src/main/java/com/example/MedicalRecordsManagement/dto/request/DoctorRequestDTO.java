package com.example.MedicalRecordsManagement.dto.request;


import lombok.Data;

@Data
public class DoctorRequestDTO {
    private String full_name;
    private String specialty;
    private String phone_number;
    private String email;
    private String license_number;
    private String status = "Active";

}


//ID INT PRIMARY KEY AUTO_INCREMENT,
//full_name NVARCHAR(100) NOT NULL,
//specialty NVARCHAR(50),
//phone_number VARCHAR(15),
//email VARCHAR(100),
//license_number VARCHAR(20) UNIQUE,
//Status NVARCHAR(20) DEFAULT 'Active'