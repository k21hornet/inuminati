package com.chihuahuawashawasha.inuminati.user.entity;

import com.chihuahuawashawasha.inuminati.entity.AbstractBaseEntity;
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
    private InuminatiUser follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_user_id", insertable = false, updatable = false)
    private InuminatiUser following;

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
