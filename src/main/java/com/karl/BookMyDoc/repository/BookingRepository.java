package com.karl.BookMyDoc.repository;

import com.karl.BookMyDoc.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query(value = """
        SELECT b.* FROM bookings b
        JOIN users u ON b.patient_id = u.u_id
        WHERE u.email = :email
        ORDER BY b.booked_at DESC
        """, nativeQuery = true)
    List<Booking> findBookingsByPatient(@Param("email") String email);
}
