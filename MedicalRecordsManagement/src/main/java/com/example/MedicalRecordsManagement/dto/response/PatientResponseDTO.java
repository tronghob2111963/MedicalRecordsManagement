package com.example.MedicalRecordsManagement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientResponseDTO {

    private String full_Name;
    private String gender;
    private String Date_Of_Birth;
    private String address;
    private String phone_Number;
    private String email;
    private String image;
    private String id_number;
    private String blood_type;
    private String marital_status;
    private String occupation;
    private String allergies;


}
