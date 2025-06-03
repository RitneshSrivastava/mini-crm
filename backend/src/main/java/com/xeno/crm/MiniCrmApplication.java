package com.xeno.crm;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class MiniCrmApplication {

	public static void main(String[] args) {
		SpringApplication.run(MiniCrmApplication.class, args);
	}

}
