package com.karl.BookMyDoc.repository;

import com.karl.BookMyDoc.entity.Slot;
import com.karl.BookMyDoc.enums.SlotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    //All Slots
    @Query(value = "SELECT * FROM slots WHERE doc_id = :doc_id", nativeQuery=true)
    List<Slot> getSlots(Long doc_id);

    //Slots Per Day
    @Query("""
    SELECT s FROM Slot s
    WHERE s.doctor.u_id = :doctorId
      AND s.startTime >= :dayStart
      AND s.startTime < :nextDayStart
    ORDER BY s.startTime
    """)
    List<Slot> findSlotsForDoctorOnDate(
            @Param("doctorId") Long doctorId,
            @Param("dayStart") LocalDateTime dayStart,
            @Param("nextDayStart") LocalDateTime nextDayStart,
            @Param("status") SlotStatus slotStatus
            );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.s_id = :slotId")
    Optional<Slot> findByIdForUpdate(@Param("slotId") Long slotId);
}
