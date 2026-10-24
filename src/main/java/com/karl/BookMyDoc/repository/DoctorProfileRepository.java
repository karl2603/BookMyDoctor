package com.karl.BookMyDoc.repository;

import com.karl.BookMyDoc.entity.DoctorProfile;
import com.karl.BookMyDoc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    //Fetches Doctor
    DoctorProfile findByUser(User user);
    //Fetches all doctors
    @Query("SELECT dp FROM DoctorProfile dp JOIN FETCH dp.user")
    List<DoctorProfile> findAllDoctorProfiles();
}
