package com.karl.BookMyDoc.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterUserRequest {
    @NotBlank(message = "Enter Username")
    private String username;

    @NotBlank(message = "Enter email address")
    @Email(message = "Enter valid email address")
    private String email;

    @NotBlank(message = "Enter password")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private MultipartFile profilePicture;
}
