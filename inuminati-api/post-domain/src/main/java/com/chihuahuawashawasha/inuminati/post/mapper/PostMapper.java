package com.chihuahuawashawasha.inuminati.post.mapper;

import com.chihuahuawashawasha.inuminati.post.dto.PostDto;
import com.chihuahuawashawasha.inuminati.post.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "likeCount", expression = "java(post.getPostLikes() != null ? post.getPostLikes().size() : 0)")
    @Mapping(target = "commentCount", expression = "java(post.getPostComments() != null ? post.getPostComments().size() : 0)")
    PostDto toDto(Post post);
}
