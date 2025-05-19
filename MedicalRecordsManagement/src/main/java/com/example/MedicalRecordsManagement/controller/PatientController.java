package com.example.MedicalRecordsManagement.controller;

import com.example.MedicalRecordsManagement.dto.request.PatientRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.dto.response.ResponseError;
import com.example.MedicalRecordsManagement.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @GetMapping("/all-patients")
    public ResponseData<?> getAllPatients(@RequestParam(defaultValue = "1") int pageNo,
                                          @RequestParam(defaultValue = "10") int pageSize,
                                          @RequestParam(defaultValue = "ID:asc") String sortBy) {
        log.info("Fetching all patients with pageNo: {}, pageSize: {}, sortBy: {}", pageNo, pageSize, sortBy);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.getAllPatients(pageNo, pageSize, sortBy));
        } catch (Exception e) {
            log.error("Error fetching patients: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching patients: " + e.getMessage());
        }
    }

    @GetMapping("/patient/{id}")
    public ResponseData<?> getPatientById(@RequestParam Long id) {
        log.info("Fetching patient with ID: {}", id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.getPatientById(id));
        } catch (Exception e) {
            log.error("Error fetching patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching patient: " + e.getMessage());
        }
    }

    @PostMapping("/create-patient")
    public ResponseData<?> createPatient(PatientRequestDTO patientDTO) {
        log.info("Creating new patient: {}", patientDTO);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.createPatient(patientDTO));
        } catch (Exception e) {
            log.error("Error creating patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error creating patient: " + e.getMessage());
        }
    }
    @PutMapping("/update-patient")
    public ResponseData<?> updatePatient(@RequestParam String id_number, PatientRequestDTO patientDTO) {
        log.info("Updating patient with ID_number: {}", id_number);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.updatePatient(id_number, patientDTO));
        } catch (Exception e) {
            log.error("Error updating patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating patient: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-patient/{id}")
    public ResponseData<?> deletePatient(@RequestParam Long id) {
        log.info("Deleting patient with ID: {}", id);
        try {
            patientService.deletePatient(id);
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    null);
        } catch (Exception e) {
            log.error("Error deleting patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error deleting patient: " + e.getMessage());
        }
    }
}
