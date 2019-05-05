package com.zrone.ecomponent.service;

import com.zrone.ecomponent.mapper.RoleMapper;
import com.zrone.ecomponent.pojo.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by user on 2019/4/9.
 */
@Service
public class RoleService {
    @Autowired
    RoleMapper roleMapper;

    // list
    public List<Role> getRoleList(){
        return roleMapper.getRoleList();
    }
}
