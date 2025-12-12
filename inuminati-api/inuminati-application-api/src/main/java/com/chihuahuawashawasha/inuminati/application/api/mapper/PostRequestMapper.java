package com.chihuahuawashawasha.inuminati.application.api.mapper;

import com.chihuahuawashawasha.inuminati.application.api.model.request.PostRequest;
import com.chihuahuawashawasha.inuminati.post.dto.PostRequestDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostRequestMapper {

    PostRequestDto toDto(PostRequest request);
}
