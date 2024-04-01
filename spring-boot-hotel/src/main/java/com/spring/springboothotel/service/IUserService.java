package com.spring.springboothotel.service;

import com.spring.springboothotel.model.User;

import java.util.List;

public interface IUserService {
    List<User> getUsers();

    User getUser(String email);

    void deleteUser(String email);

    User register(User user);
}
