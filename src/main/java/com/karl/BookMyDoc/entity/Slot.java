package com.karl.BookMyDoc.entity;

import com.karl.BookMyDoc.enums.SlotStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "slots")
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long s_id;

    @NotNull(message = "Doctor is required")
    @ManyToOne
    @JoinColumn(name = "doc_id", nullable = false)
    private User doctor;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotBlank(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private SlotStatus status;
}