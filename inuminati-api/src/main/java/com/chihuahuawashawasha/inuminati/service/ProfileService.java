package com.chihuahuawashawasha.inuminati.service;

import com.chihuahuawashawasha.inuminati.exception.UserNotFoundException;
import com.chihuahuawashawasha.inuminati.mapper.ProfileMapper;
import com.chihuahuawashawasha.inuminati.model.dto.ProfileDto;
import com.chihuahuawashawasha.inuminati.model.entity.User;
import com.chihuahuawashawasha.inuminati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    private final ProfileMapper profileMapper;

    /**
     * ユーザー名からユーザーのプロフィールを取得する。
     * @param userName ユーザー名
     * @return プロフィール
     */
    public ProfileDto findProfileByUserName(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。user_name: " + userName));
        return profileMapper.toProfileDto(user);
    }

    /**
     * ユーザーIDからユーザーのプロフィールを取得する。
     * @param userId ユーザーID
     * @return プロフィール
     */
    public ProfileDto findProfileByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。user_id: " + userId));
        return profileMapper.toProfileDto(user);
    }
}
