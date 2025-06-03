package com.xeno.crm.service;

import com.xeno.crm.entity.Campaign;
import com.xeno.crm.entity.Customer;
import com.xeno.crm.entity.CommunicationLog;
import com.xeno.crm.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final RuleEvaluatorService ruleEvaluatorService;
    private final DeliveryService deliveryService;
    private final Random random = new Random();

    public Campaign createCampaign(Campaign campaign) {
        campaign.setCreatedAt(LocalDateTime.now());
        return campaignRepository.save(campaign);
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public void triggerCampaignDelivery(Campaign campaign) {
        try {

            List<Customer> audience = ruleEvaluatorService.previewAudience(
                    campaign.getSegment().getRuleLogic()
            );


            for (Customer customer : audience) {

                String personalizedMessage = campaign.getMessage()
                        .replace("{name}", customer.getName())
                        .replace("{customer_name}", customer.getName());


                String status = random.nextDouble() < 0.9 ? "SENT" : "FAILED";


                CommunicationLog log = CommunicationLog.builder()
                        .customerId(customer.getId())
                        .campaignId(campaign.getId())
                        .message(personalizedMessage)
                        .status(status)
                        .build();

                deliveryService.logDelivery(log);
            }
        } catch (Exception e) {
            System.err.println("Campaign delivery failed: " + e.getMessage());
        }
    }
}