package org.proyecto.nvidiacorp.base.controller.dao;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;

public interface InterfaceDao <T>{
    public LinkedList<T> listAll();
    public void persist(T obj) throws Exception;
    public void update(T obj, Integer pos) throws Exception;
    public void update_by_id(T obj, Integer Id) throws Exception;
    public T get(Integer id) throws Exception;

}