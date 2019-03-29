package com.zrone.transactional.service;

import com.zrone.transactional.mapper.AccountMapper;
import com.zrone.transactional.mapper.WxUserMapper;
import com.zrone.transactional.pojo.Account;
import com.zrone.transactional.pojo.Note;
import com.zrone.transactional.pojo.WxUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by user on 2019/1/29.
 */
@Service
public class WxUserService {
    @Autowired
    WxUserMapper wxUserMapper;


    // 新增
    public void saveWxUser(WxUser wxUser){
        wxUserMapper.saveWxUser(wxUser);
    }
}
