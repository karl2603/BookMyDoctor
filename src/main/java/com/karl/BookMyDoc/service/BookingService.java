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
import java.util.ArrayList;
import java.util.List;

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

    //Concurrent Slot Booking
    @Transactional
    public BookingResponse bookSlot(BookingRequest bookingRequest){
        //Locking a slot (concurrency), @Lock PESSIMISTIC_WRITE is used to lock the slot
        Slot slot = slotRepository.findByIdForUpdate(bookingRequest.getSlotId()).orElse(null);
        //Checking Slot
        if(slot == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found");

        //Concurrency Check
        // try { Thread.sleep(10000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        
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

        //Updating Slot
        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

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
                booking.getBookedAt()
        );
    }

    //Get Patient Bookings
    public List<BookingResponse> myBookings(){
        String emailId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Booking> bookings = bookingRepository.findBookingsByPatient(emailId);
        List<BookingResponse> response = new ArrayList<>();
        for(int i=0; i<bookings.size(); i++){
            DoctorProfile doctor = doctorProfileRepository.findByUser(bookings.get(i).getSlot().getDoctor());
            response.add(new BookingResponse(
                    bookings.get(i).getB_id(),
                    doctor.getUser().getUsername(),
                    doctor.getClinicName(),
                    doctor.getClinicAddress(),
                    bookings.get(i).getSlot().getStartTime(),
                    bookings.get(i).getSlot().getEndTime(),
                    bookings.get(i).getBookingStatus(),
                    bookings.get(i).getBookedAt()
            ));
        }
        return response;
    }
}
