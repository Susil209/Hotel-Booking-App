package com.spring.springboothotel.exception;

public class PhotoNotFoundException extends RuntimeException{

    public PhotoNotFoundException(String message) {
        super(message);
    }
}
