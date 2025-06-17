package org.proyecto.nvidiacorp.base.controller.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedListNew;

public class Utiles_login {
    public static Integer ASCENDENTE = 1;
    public static Integer DESCENDENTE = 2;
    public static Integer BUSCAR = 3;
    
    public <E> HashMap<String, Object> createHasMao (String atribAnidado ,String [] atributos, E item, HashMap<String, AdapterDao> daos) throws Exception{
        HashMap<String, Object> aux = new HashMap<>();
        for(String atributo : atributos) {
            if(daos.containsKey(atributo)) {
                // Atributo relacionado
                Object relatedObj = getRelatedObject(item, atributo, daos.get(atributo));
                //System.out.print("PUASJDDASHDAWSHDBAS");
                aux.put(atributo, getClazz(relatedObj, atribAnidado));
            } else {
                // Atributo normal
                aux.put(atributo, getClazz(item, atributo));
            }
        }
        return aux;
    }

   /*  public <E> Object createObject(HashMap has, ){
        has.
    } */

    public <E> LinkedListNew<HashMap<String, Object>> getHasMap(String atribANidado ,String [] atributos, 
                                                       E[] array,
                                                       HashMap<String, AdapterDao> daos) throws Exception {
    LinkedListNew<HashMap<String, Object>> list = new LinkedListNew<>();
    
    for(E item : array) {
        list.add(createHasMao(atribANidado,atributos, item, daos));
    }
    return list;
    }

private <E> Object getRelatedObject(E obj, String relationName, AdapterDao dao) throws Exception {
    Object id = getClazz(obj, "id_" + relationName);
    if(id == null) return null;
    
    return dao.listAll().get(((Number)id).intValue() - 1);
}

    
    public List<HashMap<String, Object>> transformList(LinkedListNew<HashMap<String, Object>> lista)throws Exception{
        List<HashMap<String, Object>> listaJavaUtil = new java.util.ArrayList<>();
        for (int i = 0; i < lista.getSize(); i++) {
            listaJavaUtil.add(lista.getData(i));
        }
        return listaJavaUtil;
    }

    public String [] getAtributos(Object obj){
        Field[] array = obj.getClass().getDeclaredFields();
        LinkedListNew<String> atr = new LinkedListNew<>();
        for(int i = 0 ; i < array.length ; i ++){
            if(array[i].getName().startsWith("id_")){
               // System.out.println(array[i].getName() + "tipo >>" + array[i].getType().toString());
                atr.add(array[i].getName().substring(3));
            } else{
                atr.add(array[i].getName());
            }
            //System.out.println(array[i].getName() + "tipo >>" + atr.get(i));
        }
        System.out.println(atr.print());
        return atr.toArray();
    }
    
     public String [] getAtributosForSearch(Object obj){
        Field[] array = obj.getClass().getDeclaredFields();
        String [] atr = new String[array.length];
        for(int i = 0 ; i < array.length ; i ++){
            if(array[i].getName().startsWith("id_")){
                System.out.println(array[i]);
                atr[i] = array[i].getName().substring(3).toLowerCase();
            } else {
            atr[i] = array[i].getName();
            }
            //System.out.println(array[i].getName());
        }
         for (String s : atr) {
            System.out.println(s);
        } 
        return atr;
    } 

    public Boolean comparar(Object obj1, Object obj2, Integer type) {
        Boolean band = false;
        if (obj1 == null || obj2 == null) return false;

        if (type == ASCENDENTE) {
            if (obj1 instanceof Number && obj2 instanceof Number) {
                Number o1 = (Number) obj1;
                Number o2 = (Number) obj2;
                band = o1.doubleValue() < o2.doubleValue();
            } else {
                band = obj1.toString().compareToIgnoreCase(obj2.toString()) < 0;
            }
        } else if (type == DESCENDENTE) {
            if (obj1 instanceof Number && obj2 instanceof Number) {
                Number o1 = (Number) obj1;
                Number o2 = (Number) obj2;
                band = o1.doubleValue() > o2.doubleValue();
            } else {
                band = obj1.toString().compareToIgnoreCase(obj2.toString()) > 0;
            }
        }
           else if (type == BUSCAR){
                if (obj1 instanceof Number && obj2 instanceof Number){
                        Number o1 = (Number) obj1;
                        Number o2 = (Number) obj2;
                        return o1.doubleValue() == o2.doubleValue();
                } else{
                        return (obj1.toString().toLowerCase().contains(obj2.toString().toLowerCase()));
                }
           }
        return band;
    }

    public LinkedListNew<HashMap<String, Object>> searchL(String atributo, String valor, HashMap<String, Object> [] objs)throws Exception{
        LinkedListNew<HashMap <String , Object>> list = new LinkedListNew<>();
        if(objs.length == 0 || valor.isEmpty()) return list;

       /*  int indice = binary(objs, atributo, valor);

        for(int i = indice ; i < objs.length ; i++){
            if (!objs[i].get(atributo).toString().toLowerCase().contains(valor.trim().toLowerCase().substring(0,1))) break;
            if (objs[i].get(atributo).toString().toLowerCase().contains(valor.trim().toLowerCase())) {list.add(objs[i]);}
        } */

        if (!(objs.length == 0)) {
            Integer n = binariLineal(objs, atributo, valor);
            if (n > 0) {
                    for (int i = n; i < objs.length; i++) {
                        if (objs[i].get(atributo).toString().trim().toLowerCase().contains(valor.toLowerCase())) {
                            list.add(objs[i]);
                        }
                    }
                } else if (n < 0) {
                    n *= -1;
                    for (int i = 0; i < n; i++) {
                        if (objs[i].get(atributo).toString().trim().toLowerCase().contains(valor.toLowerCase())) {
                            list.add(objs[i]);
                        }
                    }
                } else {
                    for (int i = 0; i < objs.length; i++) {
                        if (objs[i].get(atributo).toString().trim().toLowerCase().contains(valor.toLowerCase())) {
                            list.add(objs[i]);
                    }
                }
            }
        }
       System.out.println(list.print());
        return list;
    }

    private Integer binariLineal(HashMap<String, Object> [] arrays , String atributo, String valor){
        Integer mitad= 0;
        if(!(arrays.length == 0) && !valor.isEmpty()){
            mitad = arrays.length /2;
            int index = 0;

            /* if (valor.trim().compareToIgnoreCase(arrays[mitad].get(atributo).toString().trim()) > 0 ){
                index = 1;
            } else if (valor.trim().compareToIgnoreCase(arrays[mitad].get(atributo).toString().trim()) <     0 ){
                index = -1;
            } */

            if (valor.trim().toLowerCase().charAt(0) > arrays[mitad].get(atributo).toString().trim().toLowerCase().charAt(0)){
                index = 1;
            } else if (valor.trim().toLowerCase().charAt(0) < arrays[mitad].get(atributo).toString().trim().toLowerCase().charAt(0)){
                index = -1;
            } 
            mitad = mitad * index;
        }
        System.out.println(valor);
        return mitad;
    }

    private Integer bynaryLineal(HashMap<String, String>[] arr, String attribute, String text) {
        Integer half = 0;
        if (!(arr.length == 0) && !text.isEmpty()) {
            half = arr.length / 2;
            int aux = 0;
            System.out.println(text.trim().toLowerCase().charAt(0) + "* * **" + half + ""
                    + arr[half].get(attribute).toString().trim().toLowerCase().charAt(0));
            if (text.trim().toLowerCase().charAt(0) > arr[half].get(attribute).toString().trim().toLowerCase()
                    .charAt(0))
                aux = 1;
            else if (text.trim().toLowerCase().charAt(0) < arr[half].get(attribute).toString().trim().toLowerCase()
                    .charAt(0))
                aux = -1;
            ;
            half = half * aux;
        }
        return half;
    }

    public <E> Boolean compararAtributos(String atributo, E ob1, E ob2, Integer orden, HashMap<String, AdapterDao> daos) throws Exception {
        if(daos != null && daos.containsKey(atributo)){
            Object val1 = getAtributAnidado(ob1, atributo, daos.get(atributo));
            Object val2 = getAtributAnidado(ob2, atributo, daos.get(atributo));
            return comparar(val1, val2, orden);
        }
        return comparar(getClazz(ob1, atributo), getClazz(ob2, atributo), orden);
    }

    private <E> Object getAtributAnidado(E obj, String atributo , AdapterDao dao) throws Exception{
        Object ide = getClazz(obj, "id_"+ atributo);
        if (ide == null) return null;

        String atributoAnido = "nombre";
        Object objAnida = dao.listAll().get(((Number) ide).intValue()- 1);
        return getClazz(objAnida, atributoAnido);
    }

    public Object getClazz(Object data, String atributo) throws Exception {
    String getter = "get" + atributo.substring(0,1).toUpperCase() + atributo.substring(1);
    
    /* if (data == null ){
    System.out.println("NO HAY DATA");

    }   else{
    System.out.println("DATA PERTENECIENTE A " + data.getClass().getSimpleName()); 
    } */  
        for (Method i : data.getClass().getMethods()) {
            if (i.getName().equals(getter)) {
                //System.out.println("SE ENCONTRO EL GETTER DE : "+ getter + i.invoke(data));
                return i.invoke(data);
            }
        }
         throw new NoSuchMethodException("No existe el método " + getter + " en " + data.getClass().getName());
    }

}
