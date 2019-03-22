package com.springboot.mybatis1.mapper;

import com.springboot.mybatis1.pojo.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by user on 2019/1/28.
 */
@Mapper
public interface UserMapper {

    @Select("select * from t_user")
    List<User> list();

    @SelectProvider(type = UserSqlProvider.class, method = "listByUsername")
    List<User> listByUsername(String username);

    @Results({
            @Result(property = "userId", column = "USER_ID"),
            @Result(property = "username", column = "USERNAME"),
            @Result(property = "password", column = "PASSWORD"),
            @Result(property = "mobileNum", column = "PHONE_NUM")
    })
    @Select("select * from t_user")
    List<User> listSample();

    // 用户名和密码都正确
    @Select("select * from t_user where username like #{username} and password like #{password}")
    User get(@Param("username") String username, @Param("password") String password);

    @SelectProvider(type = UserSqlProvider.class, method = "getBadUser")
    User getBadUser(@Param("username") String username, @Param("password") String password);
}
