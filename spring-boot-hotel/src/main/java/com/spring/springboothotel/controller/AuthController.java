package com.spring.springboothotel.controller;

import com.spring.springboothotel.exception.UserAlreadyExistsException;
import com.spring.springboothotel.model.User;
import com.spring.springboothotel.request.LoginRequest;
import com.spring.springboothotel.response.LoginResponse;
import com.spring.springboothotel.security.jwt.JwtUtils;
import com.spring.springboothotel.security.userSecurity.HotelUserDetails;
import com.spring.springboothotel.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserService userService;
    private final JwtUtils jwtUtils;

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

    //login a user
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = userService.authenticate(loginRequest);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwtToken = jwtUtils.generateJwtTokenForUser(authentication);
        HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        LoginResponse loginResponse = new LoginResponse(userDetails.getId(), userDetails.getEmail(), jwtToken, roles);

        return ResponseEntity.ok(loginResponse);
    }

}
