package com.zrone.transactional.service;

import com.zrone.transactional.mapper.AccountMapper;
import com.zrone.transactional.pojo.Account;
import com.zrone.transactional.pojo.Note;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by user on 2019/1/29.
 */
@Service
public class AccountService {
    @Autowired
    AccountMapper accountMapper;

    public Account getAccount(){
        return accountMapper.getAccount();
    }

    // 在业务层使用 @Transactional 开启事务，执行数据库操作后抛出异常,不成功，数据得到回滚
    @Transactional
    public void addMoney() throws Exception {

        // 先增加余额
        accountMapper.addMoney();

        // 然后遇到故障
        throw new RuntimeException("发生异常了..");

    }

    // list
    public List<Account> getAccountList(){
        return accountMapper.getAccountList();
    }

    // 新增
    public void saveAccount(Account account){
        accountMapper.saveAccount(account);
    }

    // 删除
    public void deleteAccount(String accountId){
        accountMapper.deleteAccount(accountId);
    }

    // 详情
    public Account detailAccount(String accountId){
        return accountMapper.detailAccount(accountId);
    }

    // 更新
    public void updateAccount(Account account){
        accountMapper.updateAccount(account);
    }

    // login验证
    public Account checkAccount(Account account){
        return accountMapper.checkAccount(account);
    }

    // 对应用户的note list
    public List<Note> getNoteList(String accountId){
        return accountMapper.getNoteList(accountId);
    }
}
