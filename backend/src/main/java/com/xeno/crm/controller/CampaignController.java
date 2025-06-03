package com.xeno.crm.controller;

import com.xeno.crm.dto.CampaignStatsDTO;
import com.xeno.crm.entity.Campaign;
import com.xeno.crm.service.CampaignService;
import com.xeno.crm.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;
    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@RequestBody Campaign campaign) {
        Campaign created = campaignService.createCampaign(campaign);
        // Trigger automatic campaign delivery
        campaignService.triggerCampaignDelivery(created);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/stats/{id}")
    public ResponseEntity<CampaignStatsDTO> getCampaignStats(@PathVariable("id") Long id) {
        return ResponseEntity.ok(deliveryService.getCampaignStats(id));
    }

    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @GetMapping("/history")
    public ResponseEntity<List<CampaignStatsDTO>> getCampaignHistory() {
        List<Campaign> campaigns = campaignService.getAllCampaigns();
        List<CampaignStatsDTO> stats = campaigns.stream()
                .map(c -> deliveryService.getCampaignStats(c.getId()))
                .sorted(Comparator.comparing(CampaignStatsDTO::getCampaignId).reversed())
                .collect(Collectors.toList());
        return ResponseEntity.ok(stats);
    }
}