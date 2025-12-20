package com.chihuahuawashawasha.inuminati.mapper;

import com.chihuahuawashawasha.inuminati.model.dto.PostDto;
import com.chihuahuawashawasha.inuminati.model.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.model.response.PostDetailResponse;
import com.chihuahuawashawasha.inuminati.model.response.PostResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostResponseMapper {

    PostResponse toResponse(PostDto postDto);

    PostDetailResponse toResponse(PostDto postDto, ProfileDto profileDto, Boolean isLiked);
}
