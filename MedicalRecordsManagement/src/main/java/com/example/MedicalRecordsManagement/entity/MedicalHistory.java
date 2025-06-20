package com.example.MedicalRecordsManagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "medical_history")
@AllArgsConstructor
@NoArgsConstructor
public class MedicalHistory {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient_id;

    @NotBlank(message = "condition is required")
    private String condition_name;

    @NotBlank(message = "diagnosis_date is required")
    private LocalDate diagnosis_date;

    @NotBlank(message = "severity is required")
    private  String severity;

    private String status;
    private String note;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

}
