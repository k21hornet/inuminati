package com.chihuahuawashawasha.inuminati.util;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.security.SecureRandom;

public class ShortIdGenerator implements IdentifierGenerator {

    private static final String BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int ID_LENGTH = 12;
    private static final SecureRandom random = new SecureRandom();

    @Override
    public Object generate(SharedSessionContractImplementor session, Object object) {
        return generateShortId();
    }

    /**
     * 12文字のランダムなBase62エンコードIDを生成する
     * @return 12文字のID
     */
    public static String generateShortId() {
        StringBuilder sb = new StringBuilder(ID_LENGTH);
        for (int i = 0; i < ID_LENGTH; i++) {
            sb.append(BASE62_CHARS.charAt(random.nextInt(BASE62_CHARS.length())));
        }
        return sb.toString();
    }
}
