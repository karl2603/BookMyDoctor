package com.karl.BookMyDoc.dto;

import com.karl.BookMyDoc.enums.SlotStatus;
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
    private Long slotId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SlotStatus status;
}
