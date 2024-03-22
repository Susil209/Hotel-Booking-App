package com.spring.springboothotel.exception;

public class InternalServerError extends RuntimeException{

    public InternalServerError(String message) {
        super(message);
    }
}
