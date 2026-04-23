package ru.ssau.srestapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PrivacyConfig {
    public static String PRIVACY_POLICY_VERSION;

    @Value("${privacy.policy.version}")
    public void setPrivacyPolicyVersion(String version) {
        PRIVACY_POLICY_VERSION = version;
    }
}
