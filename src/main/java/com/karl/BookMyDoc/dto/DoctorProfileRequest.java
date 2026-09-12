package com.karl.BookMyDoc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DoctorProfileRequest {
    @NotBlank(message = "Enter Clinic Name")
    private String clinicName;
    @NotBlank(message = "Enter Clinic Address")
    private String clinicAddress;
    @NotBlank(message = "Enter Specialization")
    private String specialization;
    @Positive(message = "Enter valid Consultation Fee")
    private double consultationFee;
}
