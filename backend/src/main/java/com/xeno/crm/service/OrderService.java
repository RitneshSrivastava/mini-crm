package com.xeno.crm.service;

import com.xeno.crm.entity.Order;
import com.xeno.crm.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Order> kafkaTemplate;

    public void addOrder(Order order) {
        kafkaTemplate.send("order-topic", order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}