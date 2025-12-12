package com.chihuahuawashawasha.inuminati.user.service;

import com.chihuahuawashawasha.inuminati.exception.UserNotFoundException;
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

    /**
     * メールアドレスからユーザーIDを取得
     * @param email メールアドレス
     * @return ユーザーID
     */
    public String findUserId(String email) {
        InuminatiUser user = inuminatiUserRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。email: " + email));
        return user.getUserId();
    }

    /**
     * メールアドレスからユーザー名を取得
     * @param email メールアドレス
     * @return ユーザー名
     */
    public String findUserName(String email) {
        InuminatiUser user = inuminatiUserRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。email: " + email));
        return user.getUserName();
    }
}
