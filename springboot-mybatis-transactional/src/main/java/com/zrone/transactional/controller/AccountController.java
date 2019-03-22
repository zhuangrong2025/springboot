package com.zrone.transactional.controller;


import com.zrone.transactional.pojo.Account;
import com.zrone.transactional.pojo.Note;
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
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

/**
 * Created by user on 2019/1/29.
 */
@RequestMapping
@Controller
public class AccountController {
    @Autowired
    AccountService accountService;

    @GetMapping("/")
    @ResponseBody
    public Account getAccount() {
        return accountService.getAccount();
    }

    @GetMapping("/list")
    @ResponseBody
    public List<Account> getAccountList() {
        return accountService.getAccountList();
    }

    @GetMapping("/add")
    @ResponseBody
    public Object addMoney() {
        try {
            accountService.addMoney();
        } catch (Exception e) {
            return "发生异常了：" + accountService.getAccount();
        }
        return getAccount();

    }

    // 首页  account对象赋值到thymeleaf模板中
    @GetMapping("/account")
    public String account(Model model) {
        model.addAttribute("account", getAccount());
        return "account";  // 调用模板页面account.html
    }


    @GetMapping("/action")
    public String index(Model model) {
        model.addAttribute("aaa", "我是一个兵3");
        model.addAttribute("bbb", "来自老百姓！");
        model.addAttribute("account", getAccount());
        return "index";
    }

    @RequestMapping("/Hi")
    public ModelAndView sayHello() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("user");
        modelAndView.addObject("key", 123456);
        return modelAndView;
    }

    // 列表  account列表赋值到thymeleaf模板中
    @GetMapping("/account/list")
    public String accountList(Model model) {
        model.addAttribute("accountList", getAccountList());

        return "accountList";
    }

    // 跳转到新增页面
    @GetMapping("/account/add")
    public String accountAddShow(){
        return "accountAdd";
    }

    // 新增
    @PostMapping("/account/add")
    @ResponseBody
    public Account saveAccount(@RequestBody Account account){
        accountService.saveAccount(account);
        return account;
    }

    // 删除
    @DeleteMapping("/account/{id}")
    @ResponseBody
    public String deleteAccount(@PathVariable("id") String accountId){
        accountService.deleteAccount(accountId);
        return accountId;
    }

    // 详情 显示数据要设置model
    @GetMapping("/account/{id}")
    public String detailAccount(@PathVariable("id")  String accountId,Model model, HttpServletRequest request,@CookieValue(value="nameCookie", defaultValue="") String cook,RedirectAttributes attributes){



        // 判断session和cookie值时候,两个字符串不用  == 来比较；
        if (cook.equals("")){
            return "redirect:/login";
        }else{

            // 判断session过期
            Object obj = request.getSession().getAttribute("cur_user");
            if(obj != null){
                String sessionId = ((Account)obj).getAccountId();
                if(cook.equals(sessionId)){
                    System.out.println("是这个用户");
                    // 显示这个用户看过的笔记
                    model.addAttribute("noteList", accountService.getNoteList(cook));
                }else{
                    System.out.println("非管理员");
                }
            }else{
                System.out.println("session过期");
                attributes.addFlashAttribute("expire", "session过期,请重新登录");
                return "redirect:/login";
            }

            // 这个用户信息
            model.addAttribute("account", accountService.detailAccount(accountId));
            return "accountDetail";
        }







    }

    // 跳转到修改页面
    @GetMapping("/account/update/{id}")
    public String viewAccount(@PathVariable("id")  String accountId,Model model){
        model.addAttribute("account", accountService.detailAccount(accountId));
        return "accountUpdate";
    }

    // 修改
    @PostMapping("/account/update")
    @ResponseBody
    public Account updateAccount(@RequestBody Account account){
        accountService.updateAccount(account);
        System.out.println(account.getAccountId());
        return account;
    }

    // 微信登录code
    @PostMapping("/login")
    @ResponseBody
    public JSONObject  wxLogin(@RequestBody Map<String,Object> map){
        // 将参数转为json对象用JSONParser  JSONObject

        String JSCODE = map.get("code").toString();
        System.out.println("code: " + JSCODE);

        // 后台服务器先微信服务器get请求，session_key和openid
        RestTemplate restTemplate = new RestTemplate();
        String APPID = "wx4fc998a109810918";
        String SECRET = "aa59175d5b2c06a3e30ec3e6b46d5601";
//        String JSCODE = "081yHAIb16Dlpw0PZCGb1r1kIb1yHAIV";
        String str=restTemplate.getForObject("https://api.weixin.qq.com/sns/jscode2session?appid=" + APPID + "&secret=" + SECRET + "&js_code=" + JSCODE + "&grant_type=authorization_code",String.class);

        System.out.println(str);

        // 将json字符串转为json对象
        JSONObject jsonobject = JSONObject.fromObject(str);
        return jsonobject;
    }

    /*
     * 登录
     */
    @GetMapping("/login")
    public String login(){
        return "login";
    }

    @PostMapping("/checkLogin")
    @ResponseBody
    public Account checkLogin(@RequestBody Account account, HttpServletRequest request){

        // 判断数据库有无用户名
        if(accountService.checkAccount(account) != null){

            // 登录成功account对象存储到session
            request.getSession().setAttribute("cur_user",accountService.checkAccount(account));
            // 设置1分钟session过期
            request.getSession().setMaxInactiveInterval(60);

            System.out.println("用户存在，登录成功！");
            return accountService.checkAccount(account);


        }else{
            System.out.println("用户不存在");
            Account defaultAccount = new Account();
            return defaultAccount;
        }
    }




}
