package com.karl.BookMyDoc.controller;

import com.karl.BookMyDoc.dto.DoctorProfileRequest;
import com.karl.BookMyDoc.dto.DoctorProfileResponse;
import com.karl.BookMyDoc.service.DoctorService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/home")
    public String home(){
        return "Welcome Home Doctor!";
    }

    @PostMapping("/profile")
    public ResponseEntity<DoctorProfileResponse> createDocProfile(@Valid @RequestBody DoctorProfileRequest doctorProfileRequest){
        DoctorProfileResponse doctorProfileResponse = doctorService.createDocProfile(doctorProfileRequest);
        return new ResponseEntity<>(doctorProfileResponse, HttpStatus.CREATED);
    }


}
