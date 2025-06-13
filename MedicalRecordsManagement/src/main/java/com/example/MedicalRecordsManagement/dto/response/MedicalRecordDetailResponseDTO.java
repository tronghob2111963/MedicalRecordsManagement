package com.example.MedicalRecordsManagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;


@Builder
@Data
public class MedicalRecordDetailResponseDTO {
    private Long id;
    private Long patient_id;
    private Long doctor_id;
    private String patient_Name;
    private String doctor_Name;
    private String diagnosis;
    private String treatment;
    private String visit_date;
    private String Note;
    private String status ;
}
