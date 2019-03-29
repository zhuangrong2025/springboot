package com.zrone.transactional.mapper;
import com.zrone.transactional.pojo.WxUser;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by user on 2019/1/29.
 */
@Mapper
public interface WxUserMapper {

    // 新增
    @Insert("insert into wx_users values(null,#{name},#{openid},null)")
    void saveWxUser(WxUser wxUser);


}
