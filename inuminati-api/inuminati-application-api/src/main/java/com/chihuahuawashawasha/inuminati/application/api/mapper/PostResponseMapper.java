package com.chihuahuawashawasha.inuminati.application.api.mapper;

import com.chihuahuawashawasha.inuminati.application.api.model.response.PostDetailResponse;
import com.chihuahuawashawasha.inuminati.application.api.model.response.PostResponse;
import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostResponseMapper {

    PostResponse toResponse(PostDto postDto);

    PostDetailResponse toResponse(PostDto postDto, ProfileDto profileDto);
}
