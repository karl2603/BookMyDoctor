package com.karl.BookMyDoc.service;

import com.karl.BookMyDoc.dto.SlotRequest;
import com.karl.BookMyDoc.dto.SlotResponse;
import com.karl.BookMyDoc.entity.Slot;
import com.karl.BookMyDoc.enums.SlotStatus;
import com.karl.BookMyDoc.repository.SlotRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class SlotServiceTest {

    @Mock
    SlotRepository slotRepository;

    @InjectMocks
    SlotService slotService;

    @Test
    public void getSlots_shouldReturnSlotResponses(){
        Slot slot = new Slot(
                1L,
                null,
                LocalDateTime.of(2026, 11, 20, 10, 0),
                LocalDateTime.of(2026, 11, 20, 10, 30),
                SlotStatus.AVAILABLE
                );
        Mockito.when(slotRepository.getSlots(1L)).thenReturn(List.of(slot));
        List<SlotResponse> slotResponses = slotService.getSlots(1L);

        Assertions.assertEquals(1, slotResponses.size());
        Assertions.assertEquals(1L, slotResponses.get(0).getSlotId());
        Assertions.assertEquals(slot.getStartTime(), slotResponses.get(0).getStartTime());
        Assertions.assertEquals(slot.getEndTime(), slotResponses.get(0).getEndTime());
        Assertions.assertEquals(slot.getStatus(), slotResponses.get(0).getStatus());
    }

    @Test
    public void getSlots_shouldReturnEmptyList(){
        Mockito.when(slotRepository.getSlots(1L)).thenReturn(Collections.emptyList());
        List <SlotResponse> slotResponses = slotService.getSlots(1L);

        Assertions.assertEquals(0, slotResponses.size());
    }
}
