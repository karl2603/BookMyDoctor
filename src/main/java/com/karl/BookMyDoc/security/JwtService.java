package com.karl.BookMyDoc.security;

import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
@Slf4j
public class JwtService {
    private String SecretKeyString = "122d7e9db54b1fa1315fabfc8a5ab4c2e682d9d512980d83a2976f599e1ed7c3";
    private SecretKey secretKey = Keys.hmacShaKeyFor(SecretKeyString.getBytes());
    public String generateToken(String email){
        return "Token";
    }
}
