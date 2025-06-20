package com.example.MedicalRecordsManagement.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@Table(name = "Doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long Id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 50)
    private String specialty;

    @Column(length = 15)
    private String phone_number;

    @Column(length = 100)
    private String email;


    @Column(name = "license_number",length = 20, unique = true)
    private String licenseNumber;

    @Column(length = 20)
    private String status = "Active";

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

}
