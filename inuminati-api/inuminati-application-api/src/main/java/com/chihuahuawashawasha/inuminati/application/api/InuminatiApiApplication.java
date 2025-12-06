package com.chihuahuawashawasha.inuminati.application.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.chihuahuawashawasha.inuminati")
@EntityScan(basePackages = "com.chihuahuawashawasha.inuminati")
@EnableJpaRepositories(basePackages = "com.chihuahuawashawasha.inuminati")
public class InuminatiApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(InuminatiApiApplication.class, args);
	}

}
