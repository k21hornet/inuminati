package com.chihuahuawashawasha.inuminati.application.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${auth0.audience}")
    private String audience;

    @Value("${auth0.issuer}")
    private String issuer;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.decoder(jwtDecoder())))
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Auth0の公開鍵を使用してJWTデコーダーを作成
        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromOidcIssuerLocation(issuer);

        // カスタムバリデーターを作成
        OAuth2TokenValidator<Jwt> customValidator = new OAuth2TokenValidator<Jwt>() {
            @Override
            public OAuth2TokenValidatorResult validate(Jwt jwt) {
                // 1. Issuerの検証
                String tokenIssuer = jwt.getIssuer().toString();
                if (!issuer.equals(tokenIssuer)) {
                    return OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_issuer", "Invalid issuer", null));
                }

                // 2. Audienceの検証
                Object aud = jwt.getClaim("aud");
                if (aud == null) {
                    return OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_audience", "Audience claim is missing", null));
                }

                boolean validAudience = false;

                // 文字列の場合
                if (aud instanceof String && aud.equals(audience)) {
                    validAudience = true;
                }

                // 配列の場合
                if (aud instanceof List) {
                    List<String> audList = (List<String>) aud;
                    if (audList.contains(audience)) {
                        validAudience = true;
                    }
                }

                if (!validAudience) {
                    return OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_audience", "Invalid audience", null));
                }

                // 3. 有効期限の検証（JwtValidators.createDefaultWithIssuerで自動的に行われる）

                return OAuth2TokenValidatorResult.success();
            }
        };

        // デフォルトのバリデーター（有効期限など）とカスタムバリデーターを組み合わせ
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuer);
        OAuth2TokenValidator<Jwt> combinedValidator = new DelegatingOAuth2TokenValidator<>(withIssuer, customValidator);

        jwtDecoder.setJwtValidator(combinedValidator);
        return jwtDecoder;
    }
}
