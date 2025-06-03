package com.xeno.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignStatsDTO {
    private Long campaignId;
    private int sent;
    private int failed;
    private int total;
    private String successRate;
}