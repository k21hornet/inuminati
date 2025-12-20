package com.chihuahuawashawasha.inuminati.service;

import com.chihuahuawashawasha.inuminati.exception.UserNotFoundException;
import com.chihuahuawashawasha.inuminati.model.entity.User;
import com.chihuahuawashawasha.inuminati.repository.UserRepository;
import com.chihuahuawashawasha.inuminati.util.ShortIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * 初回ログイン時にユーザーを作成
     * @param email メールアドレス
     */
    public void createUserIfNotExist(String email) {
        Optional<User> optional = userRepository.findByEmail(email);

        if (optional.isEmpty()) {
            User user = new User();
            String tmpUserName = ShortIdGenerator.generateShortId();
            user.setUserName(tmpUserName);
            user.setNickname(tmpUserName);
            user.setEmail(email);
            userRepository.save(user);
        }
    }

    /**
     * メールアドレスからユーザーIDを取得
     * @param email メールアドレス
     * @return ユーザーID
     */
    public String findUserId(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。email: " + email));
        return user.getUserId();
    }

    /**
     * メールアドレスからユーザー名を取得
     * @param email メールアドレス
     * @return ユーザー名
     */
    public String findUserName(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。email: " + email));
        return user.getUserName();
    }

    /**
     * ユーザー名からユーザーIDを取得
     * @param userName ユーザー名
     * @return ユーザーID
     */
    public String findUserIdByUserName(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりません。user_name: " + userName));
        return user.getUserId();
    }
}
