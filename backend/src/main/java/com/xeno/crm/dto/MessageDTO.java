package com.xeno.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long customerId;
    private Long campaignId;
    private String message;
    private String status; // SENT or FAILED
}