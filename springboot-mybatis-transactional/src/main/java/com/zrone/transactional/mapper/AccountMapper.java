package com.zrone.transactional.mapper;
import com.zrone.transactional.pojo.Account;
import com.zrone.transactional.pojo.Note;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by user on 2019/1/29.
 */
@Mapper
public interface AccountMapper {

    @Select("select * from account where account_id = 7")
    Account getAccount();

    // update
    @Update("update account set balance = balance + 100 where account_id = 1")
    void addMoney();

    // list
    @Select("select * from account")
    List<Account> getAccountList();

    // 新增
    @Insert("insert into account values(#{accountId},#{accountName},#{balance})")
    void saveAccount(Account account);

    // 删除
    @Delete("delete from account where account_id = #{accountId}")
    void deleteAccount(String accountId);

    // 详情
    @Select("select * from account where account_id = #{accountId}")
    Account detailAccount(String accountId);

    // 更新
    @Update("update account set account_name = #{accountName}, balance = #{balance} where account_id = #{accountId}")
    void updateAccount(Account account);

    // login验证
    @Select("select * from account where account_name = #{accountName}")
    Account checkAccount(Account account);

    // 对应用户的note list
    @Select("select * from note where account_id = #{accountId}")
    List<Note> getNoteList(String accountId);

}
