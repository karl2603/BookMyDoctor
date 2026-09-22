package com.karl.BookMyDoc.controller;

import com.karl.BookMyDoc.dto.LoginRequest;
import com.karl.BookMyDoc.dto.LoginResponse;
import com.karl.BookMyDoc.dto.RegisterUserRequest;
import com.karl.BookMyDoc.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/home")
    public String home(){
        return "Welcome Home";
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterUserRequest registerUserRequest) throws IOException {
        authService.registerUser(registerUserRequest);
        return new ResponseEntity<>("User registered successfully",HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public String loginUser(@Valid @RequestBody LoginRequest loginRequest){
        return authService.loginUser(loginRequest);
    }
}
