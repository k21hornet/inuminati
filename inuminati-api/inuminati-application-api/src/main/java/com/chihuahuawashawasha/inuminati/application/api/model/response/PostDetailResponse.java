package com.chihuahuawashawasha.inuminati.application.api.model.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDetailResponse {

    private String postId;

    private String userName;

    private String content;

    private List<PostImageResponse> postImages;

    private Boolean isLiked;

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
