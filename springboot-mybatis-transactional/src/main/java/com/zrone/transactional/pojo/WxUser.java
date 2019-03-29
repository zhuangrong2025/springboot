package com.zrone.transactional.pojo;

/**
 * Created by user on 2019/1/30.
 */
public class WxUser {
    private int id;
    private String name;
    private String openid;
    private int bind;

    public int getBind() {
        return bind;
    }

    public void setBind(int bind) {
        this.bind = bind;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }


}

