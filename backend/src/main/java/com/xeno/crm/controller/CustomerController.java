package com.xeno.crm.controller;

import com.xeno.crm.entity.Customer;
import com.xeno.crm.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<String> addCustomer(@RequestBody Customer customer) {
        System.out.println(" Received customer: " + customer);
        customerService.addCustomer(customer);
        return ResponseEntity.ok("Customer ingested successfully via Kafka");
    }


    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

}
