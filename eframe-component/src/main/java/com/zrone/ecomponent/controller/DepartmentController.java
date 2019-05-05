package com.zrone.ecomponent.controller;

import com.zrone.ecomponent.pojo.Department;
import com.zrone.ecomponent.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by user on 2019/4/8.
 */
@RequestMapping
@RestController

public class DepartmentController {
    @Autowired
    DepartmentService departmentService;

    // list
    @GetMapping("/getDataList")
    public List<Department> getDepartment(){
        System.out.println("aa");
        return departmentService.getDataList();
    }

}
