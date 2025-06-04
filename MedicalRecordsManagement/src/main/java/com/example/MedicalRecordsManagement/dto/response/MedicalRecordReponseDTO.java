package com.example.MedicalRecordsManagement.dto.response;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class MedicalRecordReponseDTO {
    private Long id;
    private String patient_Name;
    private String doctor_Name;
    private String Note;
    private String status;

}
