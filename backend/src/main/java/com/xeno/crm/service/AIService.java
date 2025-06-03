package com.xeno.crm.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateRuleFromPrompt(String prompt) {
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {

            return fallbackRule(prompt);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-3.5-turbo");
            body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
            body.put("temperature", 0.2);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions",
                    request,
                    Map.class
            );

            Map choice = (Map) ((List<?>) response.getBody().get("choices")).get(0);
            return ((Map<?, ?>) choice.get("message")).get("content").toString().trim();

        } catch (HttpClientErrorException.TooManyRequests e) {

            return fallbackRule(prompt);
        } catch (Exception e) {

            return fallbackRule(prompt);
        }
    }

    private String fallbackRule(String prompt) {

        if (prompt.toLowerCase().contains("loyal")) {
            return "visits >= 10 AND totalSpend > 5000";
        } else if (prompt.toLowerCase().contains("inactive")) {
            return "lastOrderDate > 60 days ago";
        } else {
            return "totalSpend > 1000 AND visits >= 3";
        }
    }
}
