package com.chihuahuawashawasha.inuminati.repository;

import com.chihuahuawashawasha.inuminati.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);
}

