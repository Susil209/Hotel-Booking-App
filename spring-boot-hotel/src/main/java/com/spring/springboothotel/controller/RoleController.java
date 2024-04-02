package com.spring.springboothotel.controller;

import com.spring.springboothotel.exception.RoleAlreadyExistException;
import com.spring.springboothotel.model.Role;
import com.spring.springboothotel.model.User;
import com.spring.springboothotel.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    public final IRoleService roleService;

    // get all the roles
    @GetMapping("/all")
    public ResponseEntity<List<Role>> getAllRoles(){
        return new ResponseEntity<>(roleService.getRoles(), HttpStatus.FOUND);
    }

    // create new role
    @PostMapping("/create-new-role")
    public ResponseEntity<String> createNewRole(@RequestBody Role role){
        try{
            roleService.createRole(role);
            return ResponseEntity.ok("New role created successfully.");
        }catch (RoleAlreadyExistException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // delete a role
    @DeleteMapping("/delete/{roleId}")
    public void deleteRole(@PathVariable("roleId") Long roleId){
        roleService.deleteRole(roleId);
    }

    // remove all users from the role
    // localhost:9192/roles/remove-all-users-from-role/{roleId}
    @PostMapping("/remove-all-users-from-role/{roleId}")
    public Role removeAllUsersFromRole(@PathVariable("roleId") Long roleId){
        return roleService.removeAllUsersFromRole(roleId);
    }

    // remove a user from the role
    // localhost:9192/roles/remove-user-from-role?userId={userId}&roleId={roleID}
    @PostMapping("/remove-user-from-role")
    public User removeUserFromRole(
            @RequestParam("userId") Long userId,
            @RequestParam("roleId") Long roleId){
        return roleService.removeUserFromRole(userId, roleId);
    }


    // assign a role to user
    // localhost:9192/roles/assign-user-to-role?userId={userId}&roleId={roleID}
    @PostMapping("/assign-user-to-role")
    public User assignUserToRole(
            @RequestParam("userId") Long userId,
            @RequestParam("roleId") Long roleId){
        return roleService.assignRoleToUser(userId, roleId);
    }
}
