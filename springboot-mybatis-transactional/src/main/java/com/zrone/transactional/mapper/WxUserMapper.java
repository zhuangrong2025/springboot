package com.zrone.transactional.mapper;
import com.zrone.transactional.pojo.WxUser;
import org.apache.ibatis.annotations.*;


/**
 * Created by user on 2019/1/29.
 */
@Mapper
public interface WxUserMapper {

    // 判断数据中是否有这个微信用户
    @Select("select * from wx_users where openid = #{openid}")
    WxUser checkWxUser(String openid);

    // 新增
    @Insert("insert into wx_users values(null,#{name},#{openid},null)")
    void saveWxUser(WxUser wxUser);


}
