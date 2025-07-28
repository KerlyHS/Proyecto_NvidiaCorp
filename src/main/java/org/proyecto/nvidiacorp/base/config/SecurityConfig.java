package org.proyecto.nvidiacorp.base.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.vaadin.flow.spring.security.VaadinWebSecurity;

import java.util.Base64;

import javax.crypto.spec.SecretKeySpec;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends VaadinWebSecurity {
    public static final  String LOG_OUT_URL = "/" ; 

    @Value("${jwt.auth.secret:LallaveSuperSecretaQueNadieSabePorqueEsSuperSecreta}")
    private String authorized;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        setLoginView(http, "/login","/");
        setStatelessAuthentication(http,
                                    new SecretKeySpec(Base64.getDecoder().decode(authorized), JwsAlgorithms.HS256)
                                    , authorized);
        
    }

    @Override
    protected void configure(WebSecurity web) throws Exception{
        super.configure(web);
         web.ignoring().requestMatchers(VaadinWebSecurity.getDefaultWebSecurityIgnoreMatcher())
        .requestMatchers(antMatchers("static/**")); 
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests((authz) -> authz
                .anyRequest().permitAll() // Permite acceso público a todas las rutas
            );
        return http.build();
    } 
}