package com.zrone.ecomponent.mapper;

import com.zrone.ecomponent.pojo.Department;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by user on 2019/4/9.
 */
@Mapper
public interface DepartmentMapper {
    // list
    @Select("select * from datalist")
    List<Department> getDataList();
}
