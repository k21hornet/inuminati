package com.chihuahuawashawasha.inuminati.mapper;

import com.chihuahuawashawasha.inuminati.model.dto.PostRequestDto;
import com.chihuahuawashawasha.inuminati.model.request.PostRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostRequestMapper {

    PostRequestDto toDto(PostRequest request);
}
