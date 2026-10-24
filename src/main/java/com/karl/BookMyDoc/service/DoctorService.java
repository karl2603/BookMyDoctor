package com.karl.BookMyDoc.service;

import com.karl.BookMyDoc.dto.DoctorProfileRequest;
import com.karl.BookMyDoc.dto.DoctorProfileResponse;
import com.karl.BookMyDoc.dto.SlotResponse;
import com.karl.BookMyDoc.entity.DoctorProfile;
import com.karl.BookMyDoc.entity.Slot;
import com.karl.BookMyDoc.entity.User;
import com.karl.BookMyDoc.repository.DoctorProfileRepository;
import com.karl.BookMyDoc.repository.SlotRepository;
import com.karl.BookMyDoc.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class DoctorService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private SlotRepository slotRepository;

    public DoctorProfileResponse createDocProfile(DoctorProfileRequest doctorProfileRequest){
        //Checking duplicates
        String emailId = SecurityContextHolder.getContext().getAuthentication().getName();
        //Accessing User Information and updating role to Doctor
        User doctor = userRepository.findByEmail(emailId);
        doctor.setRole("DOCTOR");
        //Saving DoctorProfile to Database
        DoctorProfile doctorProfile = new DoctorProfile();
        doctorProfile.setUser(doctor);
        doctorProfile.setClinicName(doctorProfileRequest.getClinicName());
        doctorProfile.setClinicAddress(doctorProfileRequest.getClinicAddress());
        doctorProfile.setSpecialization(doctorProfileRequest.getSpecialization());
        doctorProfile.setConsultationFee(doctorProfileRequest.getConsultationFee());
        doctorProfileRepository.save(doctorProfile);
        //Returning DoctorProfileResponse
        return new DoctorProfileResponse(doctorProfile.getUser().getUsername(), doctorProfile.getClinicName(), doctorProfile.getClinicAddress(), doctorProfile.getSpecialization(), doctorProfile.getConsultationFee());
    }

    public List<SlotResponse> getMySlots(){
        String emailId = SecurityContextHolder.getContext().getAuthentication().getName();
        User doctor = userRepository.findByEmail(emailId);
        List<Slot> slots = slotRepository.getSlots(doctor.getU_id());
        List<SlotResponse> slotResponses = new ArrayList<>();
        for(int i=0; i<slots.size(); i++){
            SlotResponse slotResponse = new SlotResponse(slots.get(i).getS_id(), slots.get(i).getStartTime(), slots.get(i).getEndTime(), slots.get(i).getStatus());
            slotResponses.add(slotResponse);
        }
        return slotResponses;
    }
}
