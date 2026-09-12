package com.karl.BookMyDoc.entity;

import jakarta.persistence.*;
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

    @ManyToOne
    @JoinColumn(name = "doc_id", nullable = false)
    private User doctor;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status;
}
