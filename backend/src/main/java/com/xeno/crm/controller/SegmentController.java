package com.xeno.crm.controller;

import com.xeno.crm.entity.Customer;
import com.xeno.crm.entity.SegmentRule;
import com.xeno.crm.service.RuleEvaluatorService;
import com.xeno.crm.service.SegmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/segments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class SegmentController {

    private final SegmentService segmentService;
    private final RuleEvaluatorService ruleEvaluatorService;

    @PostMapping
    public ResponseEntity<?> createSegment(@Valid @RequestBody SegmentRule segmentRule) {
        // Validate rule syntax before saving
        if (!ruleEvaluatorService.validateRuleSyntax(segmentRule.getRuleLogic())) {
            String error = ruleEvaluatorService.getRuleSyntaxErrors(segmentRule.getRuleLogic());
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid rule syntax: " + error);
            return ResponseEntity.badRequest().body(response);
        }

        SegmentRule savedRule = segmentService.saveSegmentRule(segmentRule);
        return ResponseEntity.ok(savedRule);
    }

    @PostMapping("/preview")
    public ResponseEntity<?> previewAudience(@RequestBody Map<String, String> request) {
        String ruleLogic = request.get("ruleLogic");

        if (ruleLogic == null || ruleLogic.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Rule logic is required");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            List<Customer> audience = ruleEvaluatorService.previewAudience(ruleLogic);
            long count = ruleEvaluatorService.getAudienceCount(ruleLogic);

            Map<String, Object> response = new HashMap<>();
            response.put("customers", audience);
            response.put("count", count);
            response.put("ruleLogic", ruleLogic);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Rule evaluation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateRule(@RequestBody Map<String, String> request) {
        String ruleLogic = request.get("ruleLogic");
        Map<String, Object> response = new HashMap<>();

        if (ruleLogic == null || ruleLogic.trim().isEmpty()) {
            response.put("valid", false);
            response.put("error", "Rule logic is required");
            return ResponseEntity.ok(response);
        }

        boolean isValid = ruleEvaluatorService.validateRuleSyntax(ruleLogic);
        response.put("valid", isValid);

        if (!isValid) {
            response.put("error", ruleEvaluatorService.getRuleSyntaxErrors(ruleLogic));
        } else {
            try {
                long count = ruleEvaluatorService.getAudienceCount(ruleLogic);
                response.put("estimatedCount", count);
            } catch (Exception e) {
                response.put("valid", false);
                response.put("error", "Rule execution failed: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SegmentRule>> getAllSegments() {
        List<SegmentRule> segments = segmentService.getAllSegments();
        return ResponseEntity.ok(segments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SegmentRule> getSegment(@PathVariable Long id) {
        SegmentRule segment = segmentService.getSegmentById(id);
        return ResponseEntity.ok(segment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSegment(@PathVariable Long id) {
        segmentService.deleteSegment(id);
        return ResponseEntity.noContent().build();
    }
}