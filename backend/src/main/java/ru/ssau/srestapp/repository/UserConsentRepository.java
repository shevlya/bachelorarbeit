package ru.ssau.srestapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssau.srestapp.entity.UserConsent;

public interface UserConsentRepository extends JpaRepository<UserConsent, Long> {
}
