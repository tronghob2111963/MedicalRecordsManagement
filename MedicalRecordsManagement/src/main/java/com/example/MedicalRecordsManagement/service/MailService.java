package com.example.MedicalRecordsManagement.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;



@Service
@RequiredArgsConstructor
@Slf4j(topic = "MAIL-SERVICE")
public class MailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    @Value("${spring.mail.from}")
    private String emailFrom;

    public String sendEmail(String to, String subject, String content, MultipartFile[] file) throws MessagingException, UnsupportedEncodingException {
        log.info("Sending....");
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(emailFrom, "Trong Ho" );

        if (to.contains(",")) {
            helper.setTo(InternetAddress.parse(to));
        } else {
            helper.setTo(to);
        }

        if (file != null) {
            for (MultipartFile multipartFile : file) {
                helper.addAttachment(Objects.requireNonNull(multipartFile.getOriginalFilename()), multipartFile);
            }
        }

        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(mimeMessage);
        log.info("Email sent successfully: recipient: {}", to);
        return "sent";
    }

    // Gửi email xác nhận cho người dùng
    public String sendEmailConfirm(String to, String subject, String username, String password) throws MessagingException, UnsupportedEncodingException {
        log.info("Sending confirmation email to: {}", to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());

        // Tạo context cho Thymeleaf
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("password", password);

        // Render template HTML
        String htmlContent = templateEngine.process("confirm-email", context);

        helper.setFrom(emailFrom, "Trong Ho");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
        log.info("Confirmation email sent successfully to: {}", to);
        return "sent";
    }
}
