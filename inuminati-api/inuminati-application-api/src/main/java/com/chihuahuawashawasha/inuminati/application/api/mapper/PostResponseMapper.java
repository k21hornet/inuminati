package com.chihuahuawashawasha.inuminati.application.api.mapper;

import com.chihuahuawashawasha.inuminati.application.api.model.response.PostResponse;
import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostResponseMapper {

    PostResponse toResponse(PostDto dto);
}
