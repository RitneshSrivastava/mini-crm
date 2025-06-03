package com.xeno.crm.service;

import com.xeno.crm.entity.Customer;
import com.xeno.crm.entity.Order;
import com.xeno.crm.entity.CommunicationLog;
import com.xeno.crm.repository.CustomerRepository;
import com.xeno.crm.repository.OrderRepository;
import com.xeno.crm.repository.CommunicationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final CommunicationLogRepository logRepository;

    @KafkaListener(topics = "customer-topic", groupId = "xeno-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeCustomer(Customer customer) {
        customerRepository.save(customer);
    }

    @KafkaListener(topics = "order-topic", groupId = "xeno-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeOrder(Order order) {
        orderRepository.save(order);
    }

    @KafkaListener(topics = "log-topic", groupId = "xeno-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeCommunicationLog(CommunicationLog log) {
        logRepository.save(log);
    }
}
