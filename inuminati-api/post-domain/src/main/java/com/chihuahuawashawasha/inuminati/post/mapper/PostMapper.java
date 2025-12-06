package com.chihuahuawashawasha.inuminati.post.mapper;

import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.post.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "likeCount", expression = "java(post.getPostLikes().size())")
    @Mapping(target = "commentCount", expression = "java(post.getPostComments().size())")
    PostDto toDto(Post post);
}
