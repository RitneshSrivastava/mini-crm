package com.xeno.crm.controller;

import com.xeno.crm.entity.CommunicationLog;
import com.xeno.crm.service.DeliveryService;
import com.xeno.crm.dto.MessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final DeliveryService deliveryService;
    private final Random random = new Random();

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody MessageDTO messageDTO) {
        // Simulate 90% success, 10% failure
        boolean isSuccess = random.nextDouble() < 0.9;
        String status = isSuccess ? "SENT" : "FAILED";

        CommunicationLog log = CommunicationLog.builder()
                .customerId(messageDTO.getCustomerId())
                .campaignId(messageDTO.getCampaignId())
                .message(messageDTO.getMessage())
                .status(status)
                .build();

        deliveryService.logDelivery(log);

        return ResponseEntity.ok("Message delivery " + status.toLowerCase() +
                " for customer " + messageDTO.getCustomerId());
    }

    @PostMapping("/delivery-receipt")
    public ResponseEntity<String> deliveryReceipt(@RequestBody CommunicationLog log) {
        deliveryService.logDelivery(log);
        return ResponseEntity.ok("Delivery receipt updated successfully");
    }
}