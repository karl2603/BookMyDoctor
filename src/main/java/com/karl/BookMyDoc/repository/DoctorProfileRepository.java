package com.karl.BookMyDoc.repository;

import com.karl.BookMyDoc.entity.DoctorProfile;
import com.karl.BookMyDoc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    DoctorProfile findByUser(User user);
}
