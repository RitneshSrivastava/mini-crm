package com.xeno.crm.service;

import com.xeno.crm.entity.UserOAuth;
import com.xeno.crm.repository.UserOAuthRepository;
import com.xeno.crm.security.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserOAuthService implements UserDetailsService {

    private final UserOAuthRepository userOAuthRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserOAuth user = userOAuthRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new CustomUserPrincipal(user, Collections.emptyMap());
    }

    public UserOAuth findByEmail(String email) {
        return userOAuthRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public UserOAuth saveUser(UserOAuth user) {
        return userOAuthRepository.save(user);
    }
}