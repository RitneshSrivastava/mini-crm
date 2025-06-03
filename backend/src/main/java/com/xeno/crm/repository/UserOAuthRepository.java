package com.xeno.crm.repository;

import com.xeno.crm.entity.UserOAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserOAuthRepository extends JpaRepository<UserOAuth, Long> {
    Optional<UserOAuth> findByEmail(String email);
    boolean existsByEmail(String email);
}