package com.chihuahuawashawasha.inuminati.mapper;

import com.chihuahuawashawasha.inuminati.model.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.model.response.ProfileResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileResponseMapper {

    ProfileResponse toResponse(
            ProfileDto dto,
            Boolean isFollowed,
            Boolean isFollowing,
            Integer followerCount,
            Integer followingCount
    );
}
