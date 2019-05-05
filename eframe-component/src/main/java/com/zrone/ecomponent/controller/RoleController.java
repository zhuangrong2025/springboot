package com.zrone.ecomponent.controller;

import com.zrone.ecomponent.pojo.Role;
import com.zrone.ecomponent.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by user on 2019/4/8.
 */
@RequestMapping
@RestController

public class RoleController {
    @Autowired
    RoleService roleService;

    // list
    @GetMapping("/role")
    public List<Role> getRoleList(){
        return roleService.getRoleList();
    }

}
