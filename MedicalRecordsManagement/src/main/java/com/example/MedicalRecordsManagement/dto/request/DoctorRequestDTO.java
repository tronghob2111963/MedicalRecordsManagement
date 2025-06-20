package com.example.MedicalRecordsManagement.dto.request;


import lombok.Data;

@Data
public class DoctorRequestDTO {
    private String full_name;
    private String specialty;
    private String phone_number;
    private String email;
    private String licenseNumber;
    private String status = "Active";

}
