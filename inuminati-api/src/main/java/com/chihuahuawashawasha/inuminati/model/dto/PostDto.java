package com.chihuahuawashawasha.inuminati.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDto {

    private String postId;

    private String userId;

    private String content;

    private List<PostImageDto> postImages;

    private Integer likeCount;

    private Integer commentCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
