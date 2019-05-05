package com.zrone.ecomponent.mapper;

import com.zrone.ecomponent.pojo.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by user on 2019/4/9.
 */
@Mapper
public interface RoleMapper {
    // role
    @Select("select * from role")
    List<Role> getRoleList();
}
