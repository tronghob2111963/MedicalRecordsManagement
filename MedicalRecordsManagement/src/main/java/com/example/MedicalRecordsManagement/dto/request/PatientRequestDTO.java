package com.example.MedicalRecordsManagement.dto.request;


import lombok.Data;

@Data
public class PatientRequestDTO {
    private String full_Name;
    private String date_of_birth;
    private String gender;
    private String phone_Number;
    private String address;
    private String id_Number;
    private String email;
}
//FullName NVARCHAR(100) NOT NULL,
//DateOfBirth DATE,
//Gender NVARCHAR(10),
//PhoneNumber VARCHAR(15),
//Address NVARCHAR(200),
//IDNumber VARCHAR(20) UNIQUE,
//Email VARCHAR(100),