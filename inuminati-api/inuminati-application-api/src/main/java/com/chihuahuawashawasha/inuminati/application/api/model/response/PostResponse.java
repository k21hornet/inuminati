package com.chihuahuawashawasha.inuminati.application.api.model.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {

    private String postId;

    private List<PostImageResponse> postImages;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    public static class PostImageResponse {

        private Long postImageId;

        private String imageUrl;

        private Integer imageOrder;
    }
}
