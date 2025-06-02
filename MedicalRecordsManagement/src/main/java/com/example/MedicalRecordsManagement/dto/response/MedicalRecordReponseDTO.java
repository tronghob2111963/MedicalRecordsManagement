package com.example.MedicalRecordsManagement.dto.response;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class MedicalRecordReponseDTO {
    private Long id;
    private Long patient_id;
    private Long dotor_id;
    private String Note;

}
