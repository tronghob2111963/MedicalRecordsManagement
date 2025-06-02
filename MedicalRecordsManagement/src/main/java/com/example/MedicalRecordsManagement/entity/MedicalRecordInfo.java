package com.example.MedicalRecordsManagement.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="medicalrecordinfo")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordInfo {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "record_id")
    private MedicalRecord record_id;

    @Column(length = 500)
    private String Diagnosis;

    @Column(length = 500)
    private String Treatment;

    @Column( nullable = false)
    private LocalDateTime Visit_Date;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();


}
