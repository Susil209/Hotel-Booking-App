package com.spring.springboothotel.service;

import com.spring.springboothotel.exception.RoleAlreadyExistException;
import com.spring.springboothotel.exception.UserAlreadyExistsException;
import com.spring.springboothotel.model.Role;
import com.spring.springboothotel.model.User;
import com.spring.springboothotel.repository.RoleRepository;
import com.spring.springboothotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(Role theRole) {
        // ROLE_USER, ROLE_ADMIN
        String roleName = "ROLE_" + theRole.getName().toUpperCase();

        // create a new role object
        Role role = new Role(roleName);

        if(roleRepository.existsByName(roleName)){
            throw new RoleAlreadyExistException(theRole.getName()+ " role already exists");
        }

        return roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long roleId) {
        // before delete the role remove all the users
        this.removeAllUsersFromRole(roleId);
        roleRepository.deleteById(roleId);
    }

    @Override
    public Role removeAllUsersFromRole(Long roleId) {
        Optional<Role> role = roleRepository.findById(roleId);
        role.ifPresent(Role :: removeAllUsersFromRole);
        return roleRepository.save(role.get());
    }

    @Override
    public User removeUserFromRole(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role> role = roleRepository.findById(roleId);

        if(role.isPresent() && role.get().getUsers().contains(user.get())){
            role.get().removeUserFromRole(user.get());
            roleRepository.save(role.get());
            return user.get();
        }


        throw new UsernameNotFoundException("User not found");
    }

    @Override
    public User assignRoleToUser(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role> role = roleRepository.findById(roleId);


        // If user already present and assigned to a role
        if(user.isPresent() && user.get().getRoles().contains(role.get())){
            throw new UserAlreadyExistsException(  user.get().getFirstName()+ " is already assigned to the" + role.get().getName()+ " role");
        }

        // assign role to user
        if (role.isPresent()){
            role.get().assignRoleToUser(user.get());
            roleRepository.save(role.get());

        }

        return user.get();
    }
}
