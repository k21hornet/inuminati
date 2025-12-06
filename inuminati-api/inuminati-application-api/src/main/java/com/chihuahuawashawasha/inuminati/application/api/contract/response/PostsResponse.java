package com.chihuahuawashawasha.inuminati.application.api.contract.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PostsResponse {

    List<PostResponse> posts;
}
