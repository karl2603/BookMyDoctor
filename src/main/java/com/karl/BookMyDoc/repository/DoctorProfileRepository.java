package com.karl.BookMyDoc.repository;

import com.karl.BookMyDoc.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
}
