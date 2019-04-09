package com.zrone.ecomponent.controller;

import com.zrone.ecomponent.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by user on 2019/4/8.
 */
@RequestMapping
@Controller

public class DiologController {
    @Autowired
    DepartmentService departmentService;

    // list
    @GetMapping("/departments")
    public String getDepartment(Model model){
        model.addAttribute("departments", departmentService.getDataList());
        return "departments";
    }

}
