package com.zrone.transactional.pojo;

import java.math.BigDecimal;

/**
 * Created by user on 2019/1/29.
 */
public class Account {
    private String accountId;
    private String accountName;
    private BigDecimal balance;

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
