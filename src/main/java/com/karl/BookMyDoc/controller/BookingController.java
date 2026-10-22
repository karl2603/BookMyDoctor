package com.karl.BookMyDoc.controller;

import com.karl.BookMyDoc.dto.BookingRequest;
import com.karl.BookMyDoc.dto.BookingResponse;
import com.karl.BookMyDoc.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> bookSlot(@Valid @RequestBody BookingRequest bookingRequest){
        BookingResponse response = bookingService.bookSlot(bookingRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
