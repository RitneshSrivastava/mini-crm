package com.xeno.crm.controller;

import com.xeno.crm.entity.Order;
import com.xeno.crm.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<String> addOrder(@RequestBody Order order) {
        orderService.addOrder(order);
        return ResponseEntity.ok("Order ingested successfully via Kafka");
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}
