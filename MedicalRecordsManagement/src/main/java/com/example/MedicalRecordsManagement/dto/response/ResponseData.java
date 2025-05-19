package com.example.MedicalRecordsManagement.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

public class ResponseData <T>{
    private final int status;
    private final String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    //method PUT PATH DELETE
    public ResponseData(int status, String message) {
        this.status = status;
        this.message = message;
    }

    //GET POST
    public ResponseData(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }




    public int getStatus() {
        return status;
    }
    public String getMessage() {
        return message;
    }
    public T getData() {
        return data;
    }
}
