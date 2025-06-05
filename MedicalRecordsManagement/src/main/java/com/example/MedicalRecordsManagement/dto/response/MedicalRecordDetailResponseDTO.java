package com.example.MedicalRecordsManagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;


@Builder
@Data
public class MedicalRecordDetailResponseDTO {
    private Long id;
    private String patient_Name;
    private String dotor_Name;
    private String diagnosis;
    private String treatment;
    private String visit_date;
    private String Note;
    private String status ;
}
