package com.karl.BookMyDoc.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginResponse {
    //JWT Token
    private String token;
    private String username;
    private String email;
    private String role;
    private String profilePictureUrl;
}