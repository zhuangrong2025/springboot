package com.zrone.transactional.controller;


import com.zrone.transactional.pojo.Account;
import com.zrone.transactional.service.AccountService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * Created by user on 2019/1/29.
 */
@RequestMapping
@Controller
public class NoteController {
    @Autowired
    AccountService accountService;



    // 跳转到新增页面
    @GetMapping("/note/add")
    public String noteAddShow(Model model, HttpServletRequest request,RedirectAttributes attributes){
        Object obj = request.getSession().getAttribute("cur_user");
        if(obj != null){
            String sessionId = ((Account)obj).getAccountId();
            model.addAttribute("accountId",sessionId);
            return "noteAdd";
        }else{
            System.out.println("session过期");
            attributes.addFlashAttribute("expire", "session过期,请重新登录");
            return "redirect:/login";
        }
    }





}
