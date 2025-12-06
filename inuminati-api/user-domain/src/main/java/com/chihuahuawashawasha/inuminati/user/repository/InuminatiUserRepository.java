package com.chihuahuawashawasha.inuminati.user.repository;

import com.chihuahuawashawasha.inuminati.user.entity.InuminatiUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InuminatiUserRepository extends JpaRepository<InuminatiUser, Long> {
}
