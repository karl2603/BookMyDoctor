package com.karl.BookMyDoc.controller;

import com.karl.BookMyDoc.dto.BookingRequest;
import com.karl.BookMyDoc.dto.BookingResponse;
import com.karl.BookMyDoc.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @GetMapping("/bookings")
    public ResponseEntity<BookingResponse> bookSlot(@Valid @RequestBody BookingRequest bookingRequest){
        BookingResponse response = bookingService.bookSlot(bookingRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
