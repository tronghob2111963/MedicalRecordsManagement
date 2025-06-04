package com.example.MedicalRecordsManagement.dto.request;


import lombok.Data;

@Data
public class MedicalRecordRequestDTO {
    private Long patient_id;
    private Long dotor_id;
    private String Note;
    private String status = "Under_treatment";
}
