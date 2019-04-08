package com.zrone.transactional.controller;


import com.zrone.transactional.pojo.Account;
import com.zrone.transactional.pojo.WxUser;
import com.zrone.transactional.service.AccountService;
import com.zrone.transactional.service.WxUserService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by user on 2019/1/29.
 */
@RequestMapping
@Controller
public class WxUserController {
    @Autowired
    WxUserService wxUserService;


    // 微信登录code
    @PostMapping("/login")
    @ResponseBody
    public JSONObject wxLogin(@RequestBody JSONObject userinfo, HttpServletRequest request){
        // 将参数转为json对象用JSONParser  JSONObject

        String JSCODE = userinfo.getString("code");
        System.out.println("code: " + JSCODE);
        System.out.println("nickname: " + userinfo.getString("nickname"));

        // 后台服务器先微信服务器get请求，session_key和openid
        RestTemplate restTemplate = new RestTemplate();
        String APPID = "wx4fc998a109810918";
        String SECRET = "aa59175d5b2c06a3e30ec3e6b46d5601";
        String str=restTemplate.getForObject("https://api.weixin.qq.com/sns/jscode2session?appid=" + APPID + "&secret=" + SECRET + "&js_code=" + JSCODE + "&grant_type=authorization_code",String.class);

        // 将json字符串转为json对象
        JSONObject jsonobject = JSONObject.fromObject(str);

        // 不用存session，因为小程序没法读取

        // 用openid判断数据库中的是否有这个用户,如果没有则添加到wx_users表中
        String openid = jsonobject.getString("openid");
        System.out.println(openid);
        if(wxUserService.checkWxUser(openid) != null){
            System.out.println("存在这个用户");
        }else{
            System.out.println("不存在这个用户!");
            WxUser wxUser = new WxUser();
            wxUser.setName(userinfo.getString("nickname"));
            wxUser.setOpenid(openid);
            wxUserService.saveWxUser(wxUser);
        }
        return jsonobject;
    }

    // 新增






}
