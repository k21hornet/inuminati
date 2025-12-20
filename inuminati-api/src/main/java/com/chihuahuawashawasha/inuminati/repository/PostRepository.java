package com.chihuahuawashawasha.inuminati.repository;

import com.chihuahuawashawasha.inuminati.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {

    List<Post> findAllByUserId(String userId);
}
