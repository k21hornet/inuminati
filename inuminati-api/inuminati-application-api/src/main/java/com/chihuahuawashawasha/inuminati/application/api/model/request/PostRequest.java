package com.chihuahuawashawasha.inuminati.application.api.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PostRequest {

    private String postId;

    @Size(max = 1000, message = "投稿内容は1000文字以内で入力してください。")
    private String content;

    @NotNull(message = "画像は必須です。")
    @Size(min = 1, message = "画像は1枚以上必要です。")
    private List<PostImageRequest> images;

    @Data
    public static class PostImageRequest {

        private Long postImageId;

        @NotBlank(message = "画像URLは必須です。")
        private String imageUrl;

        @NotNull(message = "画像順序は必須です。")
        private Integer imageOrder;
    }
}
