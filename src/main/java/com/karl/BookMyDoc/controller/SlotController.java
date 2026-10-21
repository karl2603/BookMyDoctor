package com.karl.BookMyDoc.controller;

import com.karl.BookMyDoc.dto.SlotRequest;
import com.karl.BookMyDoc.dto.SlotResponse;
import com.karl.BookMyDoc.service.SlotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SlotController {

    @Autowired
    private SlotService slotService;

    //Create Slots by doctors
    @PostMapping("/slots")
    public ResponseEntity<SlotResponse> createSlot(@Valid @RequestBody SlotRequest slotRequest){
        return new ResponseEntity<>(slotService.createSlot(slotRequest), HttpStatus.CREATED);
    }

    //User sees all the slots for each doctor
    @GetMapping("/doctors/{doctorId}/allslots")
    public List<SlotResponse> getSlots(@PathVariable("doctorId") Long doctorId){
        return slotService.getSlots(doctorId);
    }

    //User sees only the available slots for each doctor on that particular day
    @GetMapping("/doctors/{doctorId}/availableslots")
    public List<SlotResponse> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return slotService.getAvailableSlots(doctorId, date);
    }
}
