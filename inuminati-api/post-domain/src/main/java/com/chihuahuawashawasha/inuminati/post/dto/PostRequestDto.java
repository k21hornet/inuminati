package com.chihuahuawashawasha.inuminati.post.dto;

import lombok.Data;

import java.util.List;

@Data
public class PostRequestDto {

    private String postId;

    private String content;

    private List<PostImageDto> images;

    @Data
    public static class PostImageDto {

        private Long postImageId;

        private String imageUrl;

        private Integer imageOrder;
    }
}
