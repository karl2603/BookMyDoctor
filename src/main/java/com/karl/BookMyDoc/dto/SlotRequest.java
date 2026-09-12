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
public class SlotRequest {
    @NotNull(message = "Enter slot start time")
    private LocalDateTime startTime;
    @NotNull(message = "Enter slot end time")
    private LocalDateTime endTime;
}
