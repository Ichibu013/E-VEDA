package com.project.Gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main application class for the Gateway service.
 * <br>
 * The main method initializes the application using SpringApplication.run.
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.project.common","com.project.Gateway","com.project.E_VEDA"})
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

}
