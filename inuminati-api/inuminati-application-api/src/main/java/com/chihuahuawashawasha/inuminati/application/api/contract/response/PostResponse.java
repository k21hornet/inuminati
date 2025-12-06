package com.chihuahuawashawasha.inuminati.application.api.contract.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {

    private Long postId;

    private Long userId;

    private String content;

    private List<PostImageResponse> postImages;

    private Integer likeCount;

    private Integer commentCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    public static class PostImageResponse {

        private Long postImageId;

        private String imageUrl;

        private Integer imageOrder;
    }
}
