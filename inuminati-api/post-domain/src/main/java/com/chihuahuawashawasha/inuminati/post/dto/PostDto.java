package com.chihuahuawashawasha.inuminati.post.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDto {

    private Long postId;

    private Long userId;

    private String content;

    private List<PostImageDto> postImages;

    private Integer likeCount;

    private Integer commentCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
