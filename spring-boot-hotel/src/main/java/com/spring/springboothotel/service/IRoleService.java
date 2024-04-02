package com.spring.springboothotel.service;

import com.spring.springboothotel.model.Role;
import com.spring.springboothotel.model.User;

import java.util.List;

public interface IRoleService {
    List<Role> getRoles();

    Role createRole(Role role);

    void deleteRole(Long roleId);

    Role removeAllUsersFromRole(Long roleId);

    User removeUserFromRole(Long userId, Long roleId);

    User assignRoleToUser(Long userId, Long roleId);
}
