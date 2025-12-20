package com.chihuahuawashawasha.inuminati.model.entity;

import com.chihuahuawashawasha.inuminati.model.entity.base.AbstractBaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "post_likes")
public class PostLike extends AbstractBaseEntity {

    @EmbeddedId
    private PostLikeId postLikeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", insertable = false, updatable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Getter
    @Setter
    @Embeddable
    public static class PostLikeId {

        @Column(name = "post_id", nullable = false)
        private String postId;

        @Column(name = "user_id", nullable = false)
        private String userId;
    }
}
