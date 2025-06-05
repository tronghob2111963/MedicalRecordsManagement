package com.example.MedicalRecordsManagement.dto.request;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MedicalRecordRequestDTO {
    private Long patient_id;
    private Long doctor_id;
    private String diagnosis;
    private String treatment;
    private String visit_date;
    private String Note;
    private String status = "Under_treatment";
}
