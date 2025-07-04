package com.example.MedicalRecordsManagement.dto.request;


import com.example.MedicalRecordsManagement.common.UserRole;
import lombok.Getter;
import lombok.ToString;


@Getter
@ToString
public class UserCreationRequest {
    private String username;
    private String password;
    private UserRole role;
    private Long doctorId;
}
