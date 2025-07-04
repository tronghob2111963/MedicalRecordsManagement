package com.example.MedicalRecordsManagement.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientListResponseDTO {
    private String full_Name;
    private String gender;
    private String Date_Of_Birth;
    private String address;
    private String phone_Number;
}
