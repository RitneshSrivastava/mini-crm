package com.xeno.crm.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();


        String token = jwtUtils.generateJwtToken(userPrincipal.getUsername(), userPrincipal.getName());


        String redirectUrl = "https://xenocustomer.netlify.app/auth/callback?token=" + token;

        response.sendRedirect(redirectUrl);
    }
}
