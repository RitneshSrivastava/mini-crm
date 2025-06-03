package com.xeno.crm.service;

import com.xeno.crm.entity.UserOAuth;
import com.xeno.crm.repository.UserOAuthRepository;
import com.xeno.crm.security.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserOAuthRepository userOAuthRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        Object emailObj = oauth2User.getAttribute("email");
        if (!(emailObj instanceof String email) || email.isBlank()) {
            throw new OAuth2AuthenticationException("Email is missing or invalid");
        }

        Object nameObj = oauth2User.getAttribute("name");
        String name = (nameObj instanceof String s && !s.isBlank()) ? s : "Unknown";

        UserOAuth user = userOAuthRepository.findByEmail(email).orElseGet(UserOAuth::new);
        user.setEmail(email);
        user.setName(name);

        userOAuthRepository.save(user);
        return new CustomUserPrincipal(user, oauth2User.getAttributes());
    }

    private OAuth2User processOAuth2User(OAuth2User oauth2User) {
        Object emailObj = oauth2User.getAttribute("email");
        if (!(emailObj instanceof String email)) {
            throw new OAuth2AuthenticationException("Email not provided or invalid by OAuth provider");
        }

        Object nameObj = oauth2User.getAttribute("name");
        String name = (nameObj instanceof String) ? (String) nameObj : "Unknown";

        UserOAuth user = userOAuthRepository.findByEmail(email).orElseGet(UserOAuth::new);
        user.setEmail(email);
        user.setName(name);

        userOAuthRepository.save(user);
        return new CustomUserPrincipal(user, oauth2User.getAttributes());
    }
}
