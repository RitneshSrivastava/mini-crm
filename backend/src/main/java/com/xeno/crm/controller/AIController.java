package com.xeno.crm.controller;

import com.xeno.crm.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {
    private final AIService aiService;

    @PostMapping("/generate-rule")
    public ResponseEntity<Map<String, String>> generateRule(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");
        String rule = aiService.generateRuleFromPrompt(prompt);
        return ResponseEntity.ok(Map.of("ruleLogic", rule));
    }
}
