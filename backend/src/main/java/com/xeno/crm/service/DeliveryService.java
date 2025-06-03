package com.xeno.crm.service;

import com.xeno.crm.dto.CampaignStatsDTO;
import com.xeno.crm.entity.CommunicationLog;
import com.xeno.crm.repository.CommunicationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final CommunicationLogRepository communicationLogRepository;

    public CommunicationLog logDelivery(CommunicationLog log) {
        return communicationLogRepository.save(log);
    }
    public CampaignStatsDTO getCampaignStats(Long campaignId) {
        List<CommunicationLog> logs = communicationLogRepository.findAll().stream()
                .filter(log -> log.getCampaignId().equals(campaignId))
                .toList();

        int sent = (int) logs.stream().filter(log -> "SENT".equalsIgnoreCase(log.getStatus())).count();
        int failed = (int) logs.stream().filter(log -> "FAILED".equalsIgnoreCase(log.getStatus())).count();
        int total = logs.size();
        String successRate = total > 0 ? String.format("%.2f%%", (sent * 100.0 / total)) : "0%";

        return new CampaignStatsDTO(campaignId, sent, failed, total, successRate);
    }

    public List<CommunicationLog> getLogsForCampaign(Long campaignId) {
        return communicationLogRepository.findAll().stream()
                .filter(log -> log.getCampaignId().equals(campaignId))
                .toList();
    }
}
