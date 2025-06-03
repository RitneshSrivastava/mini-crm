package com.xeno.crm.service;

import com.xeno.crm.entity.Customer;
import com.xeno.crm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final KafkaTemplate<String, Customer> kafkaTemplate;

    public void addCustomer(Customer customer) {
        kafkaTemplate.send("customer-topic", customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}
