package ru.ssau.srestapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ssau.srestapp.config.PrivacyConfig;

@RestController
@RequestMapping("/api/public")
public class PrivacyController {

    @GetMapping("/privacy-version")
    public String getPrivacyVersion() {
        return PrivacyConfig.PRIVACY_POLICY_VERSION;
    }
}
