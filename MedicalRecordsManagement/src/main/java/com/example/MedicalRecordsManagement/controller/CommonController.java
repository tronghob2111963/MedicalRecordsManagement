package com.example.MedicalRecordsManagement.controller;


import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.dto.response.ResponseError;
import com.example.MedicalRecordsManagement.service.MailService;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.UnsupportedEncodingException;

import static org.springframework.http.HttpStatus.ACCEPTED;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Slf4j
@RestController
@RequestMapping("/common")
public record CommonController(MailService mailService) {

    @PostMapping("/send-email")
    public ResponseData<?> sendEmail(@RequestParam String recipients, @RequestParam String subject,
                                     @RequestParam String content, @RequestParam(required = false) MultipartFile[] files) {
        log.info("Request GET /common/send-email");
        try {
            return new ResponseData(ACCEPTED.value(), mailService.sendEmail(recipients, subject, content, files));
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Sending email was failure, message={}", e.getMessage(), e);
            return new ResponseError(BAD_REQUEST.value(), "Sending email was failure");
        }
    }
}
