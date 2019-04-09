package com.zrone.ecomponent.service;

import com.zrone.ecomponent.mapper.DepartmentMapper;
import com.zrone.ecomponent.pojo.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by user on 2019/4/9.
 */
@Service
public class DepartmentService {
    @Autowired
    DepartmentMapper departmentMapper;

    // list
    public List<Department> getDataList(){
        return departmentMapper.getDataList();
    }
}
