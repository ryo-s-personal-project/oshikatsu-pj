package com.oshikatsu_pj.oshikatsu.oshimember.domain.exception;

public class OshiMemberAlreadyExistsException extends RuntimeException {
    public OshiMemberAlreadyExistsException(String message) {
        super(message);
    }
}
