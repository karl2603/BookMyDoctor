package com.karl.BookMyDoc.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DoctorProfileResponse {
    private String doctorName;
    private String clinicName;
    private String clinicAddress;
    private String specialization;
    private double consultationFee;
}
