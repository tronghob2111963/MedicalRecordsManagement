package com.example.MedicalRecordsManagement.dto.request;


import lombok.Data;

@Data
public class PatientRequestDTO {
    private String full_Name;
    private String date_of_birth;
    private String gender;
    private String phone_Number;
    private String address;
    private String id_Number;
    private String email;
    private String blood_type;
    private String marital_status;
    private String occupation;
    private String allergies;

}
//ALTER TABLE Patients
//ADD COLUMN blood_type NVARCHAR(5),
//ADD COLUMN marital_status NVARCHAR(20),
//ADD COLUMN occupation NVARCHAR(100),
//ADD COLUMN allergies NVARCHAR(500);