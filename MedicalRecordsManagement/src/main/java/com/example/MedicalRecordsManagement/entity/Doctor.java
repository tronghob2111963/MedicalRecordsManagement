package com.example.MedicalRecordsManagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Doctors")
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer Id;

    @Column(nullable = false, length = 100)
    private String full_name;

    @Column(length = 50)
    private String specialty;

    @Column(length = 15)
    private String phone_number;

    @Column(length = 100)
    private String email;

    @Column(length = 20, unique = true)
    private String license_Number;

    @Column(length = 20)
    private String status = "Active";

}
