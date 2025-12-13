package com.chihuahuawashawasha.inuminati.application.api.mapper;

import com.chihuahuawashawasha.inuminati.application.api.model.response.ProfileResponse;
import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileResponseMapper {

    ProfileResponse toResponse(ProfileDto dto, Boolean isFollowed, Boolean isFollowing);
}
