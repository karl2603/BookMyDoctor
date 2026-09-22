package com.karl.BookMyDoc.service;

import com.karl.BookMyDoc.dto.LoginRequest;
import com.karl.BookMyDoc.dto.LoginResponse;
import com.karl.BookMyDoc.dto.RegisterUserRequest;
import com.karl.BookMyDoc.entity.User;
import com.karl.BookMyDoc.repository.UserRepository;
import com.karl.BookMyDoc.security.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Slf4j
public class AuthService {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authManager;

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

    public String loginUser(LoginRequest loginRequest){
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());
        Authentication authentication = authManager.authenticate(authToken);
        if(authentication.isAuthenticated()){
            String jwtToken = jwtService.generateToken(loginRequest.getEmail());
            return jwtToken;
        }
        return null;
    }
}
