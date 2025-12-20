package com.chihuahuawashawasha.inuminati.mapper;

import com.chihuahuawashawasha.inuminati.model.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.model.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileDto toProfileDto(User user);
}
