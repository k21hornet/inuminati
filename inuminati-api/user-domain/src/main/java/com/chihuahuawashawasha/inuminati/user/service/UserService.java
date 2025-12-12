package com.chihuahuawashawasha.inuminati.user.service;

import com.chihuahuawashawasha.inuminati.user.entity.InuminatiUser;
import com.chihuahuawashawasha.inuminati.user.repository.InuminatiUserRepository;
import com.chihuahuawashawasha.inuminati.util.ShortIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final InuminatiUserRepository inuminatiUserRepository;

    /**
     * 初回ログイン時にユーザーを作成
     * @param email メールアドレス
     */
    public void createUserIfNotExist(String email) {
        Optional<InuminatiUser> optional = inuminatiUserRepository.findByEmail(email);

        if (optional.isEmpty()) {
            InuminatiUser user = new InuminatiUser();
            String tmpUserName = ShortIdGenerator.generateShortId();
            user.setUserName(tmpUserName);
            user.setNickname(tmpUserName);
            user.setEmail(email);
            inuminatiUserRepository.save(user);
        }
    }
}
