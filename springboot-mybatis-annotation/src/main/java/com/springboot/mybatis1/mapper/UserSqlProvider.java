package com.springboot.mybatis1.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.jdbc.SQL;

/**
 * Created by user on 2019/1/28.
 */
public class UserSqlProvider {
    public String listByUsername(String username){
        return "select * from t_user where username = #{username}";
    }

    /**
     * 方式2：也可以根据官方提供的API来编写动态SQL。
     */
    public String getBadUser(@Param("username") String username, @Param("password") String password) {
        return new SQL() {{
            SELECT("*");
            FROM("t_user");
            if (username != null && password != null) {
                WHERE("username like #{username} and password like #{password}");
            } else {
                WHERE("1=2");
            }
        }}.toString();
    }
}
