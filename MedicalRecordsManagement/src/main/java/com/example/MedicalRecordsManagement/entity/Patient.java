package com.example.MedicalRecordsManagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Setter
@Getter
@Entity
@Table(name = "Patients")
@Builder
@NoArgsConstructor // Thêm default constructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer ID;

    @Column(nullable = false, length = 100)
    private String full_Name;

    private LocalDate Date_Of_Birth;

    @Column(length = 10)
    private String gender;

    @Column(length = 15)
    private String phone_Number;

    @Column(length = 200)
    private String address;

    @Column(length = 20, unique = true)
    private String id_number;

    @Column(length = 100)
    private String email;

    @Column(length = 100)
    private String image;


}
