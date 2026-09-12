package com.karl.BookMyDoc.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SlotResponse {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
}
