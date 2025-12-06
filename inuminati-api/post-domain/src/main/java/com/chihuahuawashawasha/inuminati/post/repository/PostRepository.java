package com.chihuahuawashawasha.inuminati.post.repository;

import com.chihuahuawashawasha.inuminati.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
