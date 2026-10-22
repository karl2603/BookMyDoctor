package com.karl.BookMyDoc.service;

import com.karl.BookMyDoc.dto.BookingRequest;
import com.karl.BookMyDoc.dto.BookingResponse;
import com.karl.BookMyDoc.entity.Booking;
import com.karl.BookMyDoc.entity.DoctorProfile;
import com.karl.BookMyDoc.entity.Slot;
import com.karl.BookMyDoc.entity.User;
import com.karl.BookMyDoc.enums.BookingStatus;
import com.karl.BookMyDoc.enums.SlotStatus;
import com.karl.BookMyDoc.repository.BookingRepository;
import com.karl.BookMyDoc.repository.DoctorProfileRepository;
import com.karl.BookMyDoc.repository.SlotRepository;
import com.karl.BookMyDoc.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class BookingService {
    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Transactional
    public BookingResponse bookSlot(BookingRequest bookingRequest){
        //Locking a slot (concurrency), @Lock PESSIMISTIC_WRITE is used to lock the slot
        Slot slot = slotRepository.findByIdForUpdate(bookingRequest.getSlotId()).orElse(null);
        //Checking Slot
        if(slot == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found");

        //Checking Slot Availability
        if(slot.getStatus() != SlotStatus.AVAILABLE) throw  new ResponseStatusException(HttpStatus.CONFLICT, "Slot is no longer available");

        //Retrieving User Credentials
        String emailAddress = SecurityContextHolder.getContext().getAuthentication().getName();
        User patient = userRepository.findByEmail(emailAddress);

        //Saving Booking
        Booking booking = new Booking();
        booking.setSlot(slot);
        booking.setPatient(patient);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setBookedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        //Retrieving Doctor And Clinic Details
        DoctorProfile doctor = doctorProfileRepository.findByUser(slot.getDoctor());

        //Returning Response
        return new BookingResponse(
                booking.getB_id(),
                doctor.getUser().getUsername(),
                doctor.getClinicName(),
                doctor.getClinicAddress(),
                booking.getSlot().getStartTime(),
                booking.getSlot().getEndTime(),
                BookingStatus.CONFIRMED,
                LocalDateTime.now()
        );
    }
}
