package com.chihuahuawashawasha.inuminati.user.service;

import com.chihuahuawashawasha.inuminati.exception.UserNotFoundException;
import com.chihuahuawashawasha.inuminati.user.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.user.entity.InuminatiUser;
import com.chihuahuawashawasha.inuminati.user.mapper.ProfileMapper;
import com.chihuahuawashawasha.inuminati.user.repository.InuminatiUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final InuminatiUserRepository inuminatiUserRepository;

    private final ProfileMapper profileMapper;

    /**
     * ユーザーのプロフィールを取得する。
     * @param userId ユーザーID
     * @return プロフィール
     */
    public ProfileDto findProfile(String userId) {
        InuminatiUser user = inuminatiUserRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。user_id: " + userId));
        return profileMapper.toProfileDto(user);
    }
}
