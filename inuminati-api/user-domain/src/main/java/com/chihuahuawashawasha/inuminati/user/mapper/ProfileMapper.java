package com.chihuahuawashawasha.inuminati.user.mapper;

import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.user.entity.InuminatiUser;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileDto toProfileDto(InuminatiUser user);
}
