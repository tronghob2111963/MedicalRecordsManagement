package com.example.MedicalRecordsManagement.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorResponseDTO {
    private Long id;
    private String full_name;
    private String specialty;
    private String phone_number;
    private String email;
    private String license_Number;
    private String status;
}
