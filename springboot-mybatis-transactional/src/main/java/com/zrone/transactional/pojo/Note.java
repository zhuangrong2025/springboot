package com.zrone.transactional.pojo;


/**
 * Created by user on 2019/1/29.
 */
public class Note {
    private String accountId;
    private int nid;
    private String text;

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public int getNid() {
        return nid;
    }

    public void setNid(int nid) {
        this.nid = nid;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
