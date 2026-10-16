package com.karl.BookMyDoc.repository;

import com.karl.BookMyDoc.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    @Query(value = "SELECT * FROM slots WHERE doc_id = :doc_id", nativeQuery=true)
    List<Slot> getSlots(Long doc_id);
}
