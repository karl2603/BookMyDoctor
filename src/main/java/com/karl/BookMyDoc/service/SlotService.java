package com.karl.BookMyDoc.service;

import com.karl.BookMyDoc.dto.SlotRequest;
import com.karl.BookMyDoc.dto.SlotResponse;
import com.karl.BookMyDoc.entity.Slot;
import com.karl.BookMyDoc.entity.User;
import com.karl.BookMyDoc.repository.SlotRepository;
import com.karl.BookMyDoc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    public SlotResponse createSlot(SlotRequest slotRequest){
        //Validation
        if(!slotRequest.getStartTime().isBefore(slotRequest.getEndTime())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time should be before end time");
        //TO-DO make sure that the slots time dont clash with one and another.

        //Saving Slot to DB
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        Slot slot = new Slot();
        slot.setDoctor(user);
        slot.setStartTime(slotRequest.getStartTime());
        slot.setEndTime(slotRequest.getEndTime());
        slot.setStatus("AVAILABLE");
        slotRepository.save(slot);
        //Returning Slot response
        return new SlotResponse(slotRequest.getStartTime(), slotRequest.getEndTime(), slot.getStatus());
    }
}
