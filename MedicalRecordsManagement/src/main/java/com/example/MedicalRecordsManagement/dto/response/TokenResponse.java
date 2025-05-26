package com.example.MedicalRecordsManagement.dto.response;


import com.example.MedicalRecordsManagement.common.UserRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class TokenResponse implements Serializable {
    private String AccessToken;
    private String RefreshToken;
    private UserRole role;
}
