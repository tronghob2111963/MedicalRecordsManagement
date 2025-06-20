package com.example.MedicalRecordsManagement.dto.request;

public class MedicalHistoryRequest {
    private Long patient_id;
    private String diagnosis;
    private String treatment;
    private String Note;
    private String status = "Under_treatment";
}
