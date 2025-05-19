package com.example.MedicalRecordsManagement.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

public class ResponseScuccess extends ResponseEntity<ResponseScuccess.Payload> {

    //mo ta du lieu tra ve cho cac API PUT PPATCH DELETE
    public ResponseScuccess(HttpStatusCode status, String message) {
        super(new Payload(status.value(),message),status);
    }

    //GET POST
    public ResponseScuccess(HttpStatusCode status, String message, Object data) {
        super(new Payload(status.value(),message,data), HttpStatus.OK);
    }

    public static class Payload {
        private int status;
        private String message;
        private Object data;

        public int getStatus() {
            return status;
        }

        public Payload(int status, String message) {
            this.status = status;
            this.message = message;
        }
        public Payload(int status, String message, Object data) {
            this.status = status;
            this.message = message;
            this.data = data;
        }


        public void setStatus(int status) {
            this.status = status;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Object getData() {
            return data;
        }

        public void setData(Object data) {
            this.data = data;
        }
    }
}
