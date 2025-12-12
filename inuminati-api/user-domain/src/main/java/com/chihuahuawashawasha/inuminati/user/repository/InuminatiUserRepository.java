package com.chihuahuawashawasha.inuminati.user.repository;

import com.chihuahuawashawasha.inuminati.user.entity.InuminatiUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InuminatiUserRepository extends JpaRepository<InuminatiUser, String> {
    Optional<InuminatiUser> findByEmail(String email);
}
