package com.chihuahuawashawasha.inuminati.model.entity;

import com.chihuahuawashawasha.inuminati.model.entity.base.AbstractBaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "follows")
public class Follow extends AbstractBaseEntity {

    @EmbeddedId
    private FollowId followId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_user_id", insertable = false, updatable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_user_id", insertable = false, updatable = false)
    private User following;

    @Getter
    @Setter
    @Embeddable
    public static class FollowId {

        @Column(name = "follower_user_id", nullable = false)
        private String followerUserId;

        @Column(name = "following_user_id", nullable = false)
        private String followingUserId;
    }
}
