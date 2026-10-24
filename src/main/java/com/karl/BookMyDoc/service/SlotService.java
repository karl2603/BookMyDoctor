package com.karl.BookMyDoc.service;

import com.karl.BookMyDoc.dto.SlotRequest;
import com.karl.BookMyDoc.dto.SlotResponse;
import com.karl.BookMyDoc.entity.Slot;
import com.karl.BookMyDoc.entity.User;
import com.karl.BookMyDoc.enums.SlotStatus;
import com.karl.BookMyDoc.repository.SlotRepository;
import com.karl.BookMyDoc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    public SlotResponse createSlot(SlotRequest slotRequest){
        //Validation
        if(!slotRequest.getStartTime().isBefore(slotRequest.getEndTime())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time should be before end time");
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        List<Slot> slots = slotRepository.getSlots(user.getU_id());
        Slot slot = new Slot();
        slot.setDoctor(user);
        slot.setStartTime(slotRequest.getStartTime());
        slot.setEndTime(slotRequest.getEndTime());
        slot.setStatus(SlotStatus.AVAILABLE);
        for(int i=0; i<slots.size(); i++){
            Slot checkSlot = slots.get(i);
            if (checkSlot.getStartTime().isBefore(slot.getEndTime())
                    && checkSlot.getEndTime().isAfter(slot.getStartTime())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot overlaps with an existing slot");
            }
        }
        slotRepository.save(slot);
        //Returning Slot response
        return new SlotResponse(slot.getS_id(), slotRequest.getStartTime(), slotRequest.getEndTime(), slot.getStatus());
    }
    //Get All Slots
    public List<SlotResponse> getSlots(Long doctorId){
        List<Slot> slots = slotRepository.getSlots(doctorId);
        List<SlotResponse> slotResponses = new ArrayList<>();
        for(int i=0; i<slots.size(); i++){
            SlotResponse slotResponse = new SlotResponse(slots.get(i).getS_id(), slots.get(i).getStartTime(), slots.get(i).getEndTime(), slots.get(i).getStatus());
            slotResponses.add(slotResponse);
        }
        return slotResponses;
    }
    //Get Available Slots on that day
    public List<SlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime nextDayStart = date.plusDays(1).atStartOfDay();

        List<Slot> slots =
                slotRepository.findSlotsForDoctorOnDate(
                        doctorId,
                        dayStart,
                        nextDayStart
                );

        List<SlotResponse> responses = new ArrayList<>();

        for(int i=0; i<slots.size(); i++){
            Slot slot = slots.get(i);
            SlotResponse slotResponse = new SlotResponse(slot.getS_id(), slot.getStartTime(), slot.getEndTime(), slot.getStatus());
            responses.add(slotResponse);
        }
        return responses;
        }
}
