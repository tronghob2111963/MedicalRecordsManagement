package com.example.MedicalRecordsManagement.entity;


import com.example.MedicalRecordsManagement.common.MedicalRecordStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "medicalrecords")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient_id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor_id;



    @Column(length = 500)
    private String note;

    @Column(length = 500)
    @Enumerated(EnumType.STRING)
    private MedicalRecordStatus status;


    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();


}
