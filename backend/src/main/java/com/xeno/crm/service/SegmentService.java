package com.xeno.crm.service;

import com.xeno.crm.entity.SegmentRule;
import com.xeno.crm.repository.SegmentRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SegmentService {
    private final SegmentRuleRepository segmentRuleRepository;

    public SegmentRule saveSegmentRule(SegmentRule rule) {
        return segmentRuleRepository.save(rule);
    }

    public List<SegmentRule> getAllSegments() {
        return segmentRuleRepository.findAll();
    }

    public SegmentRule getSegmentById(Long id) {
        return segmentRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Segment not found: " + id));
    }

    public void deleteSegment(Long id) {
        segmentRuleRepository.deleteById(id);
    }
}
