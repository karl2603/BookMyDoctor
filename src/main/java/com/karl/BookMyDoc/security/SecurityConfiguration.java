package com.karl.BookMyDoc.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {
    //Custom Security Filer Chain
    @Bean
    public SecurityFilterChain securityFilterChain(){
        //Will Code once endpoints are designed
    }

    //DaoAuthProvider
    @Bean
    public AuthenticationProvider authenticationProvider(MyUserDetailsService userDetailsService){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        return authProvider;
    }

    //Authentication Manager Bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig){
        return authConfig.getAuthenticationManager();
    }
}
