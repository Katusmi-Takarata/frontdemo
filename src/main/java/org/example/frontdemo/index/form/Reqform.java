package org.example.frontdemo.index.form;

public class Reqform {
    private String name;
    private String sex;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Reqform(String name, String sex) {
        this.name = name;
        this.sex = sex;
    }
}
