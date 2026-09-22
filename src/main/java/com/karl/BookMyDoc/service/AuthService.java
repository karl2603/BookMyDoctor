package com.karl.BookMyDoc.service;

import com.karl.BookMyDoc.dto.LoginRequest;
import com.karl.BookMyDoc.dto.LoginResponse;
import com.karl.BookMyDoc.dto.RegisterUserRequest;
import com.karl.BookMyDoc.entity.User;
import com.karl.BookMyDoc.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Slf4j
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    //Password Encoder
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public void registerUser(RegisterUserRequest registerUserRequest) throws IOException {
        User user = new User();
        user.setUsername(registerUserRequest.getUsername());
        user.setEmail(registerUserRequest.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(registerUserRequest.getPassword()));
        user.setRole("PATIENT");
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public LoginResponse loginUser(LoginRequest loginRequest){

    }
}
