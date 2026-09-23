package com.karl.BookMyDoc.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    private String SecretKeyString = "122d7e9db54b1fa1315fabfc8a5ab4c2e682d9d512980d83a2976f599e1ed7c3";
    private SecretKey secretKey = Keys.hmacShaKeyFor(SecretKeyString.getBytes());

    public String generateToken(String email){
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public String extractUsername(String jwtToken){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload()
                .getSubject();
    }

    public boolean validateJwtToken(String jwtToken, UserDetails userDetails){
        String username = extractUsername(jwtToken);
        return username.equals(userDetails.getUsername()) && !isExpired(jwtToken);
    }

    public boolean isExpired(String jwtToken){
        Date expirationDate = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload()
                .getExpiration();

        return expirationDate.before(new Date());
    }

}
