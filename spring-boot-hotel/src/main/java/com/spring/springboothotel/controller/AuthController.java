package com.spring.springboothotel.controller;

import com.spring.springboothotel.exception.UserAlreadyExistsException;
import com.spring.springboothotel.model.User;
import com.spring.springboothotel.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserService userService;

    // register a user
    @PostMapping("/register-user")
    public ResponseEntity<String> registerUser(@RequestBody User user){
        try{
            userService.register(user);
            return ResponseEntity.ok("Registration successful");
        }catch (UserAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

}
