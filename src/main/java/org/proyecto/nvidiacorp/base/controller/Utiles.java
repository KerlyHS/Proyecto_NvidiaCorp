package org.proyecto.nvidiacorp.base.controller;

import java.text.DecimalFormat;

public class Utiles {
    public static Integer ASCENDENTE = 1;
    public static Integer DESCENDENTE = 2;
    public static Integer START; // 1
    public static Integer END;   // 2
    public static Integer CONSTIANS; // lo que dios quiera

    public String tranformStringFloatTwoDecimal(float dato) {
        DecimalFormat df = new DecimalFormat("#.##");
        return df.format(dato);
    }

    public Boolean constanceArray(Object[] array, String text) {
        Boolean band = false;
        for (Object a : array) {
            if (a.toString().equals(text)) {
                band = true;
                break;
            }
        }
        return band;
    }

    public boolean compararAtributos(String atributo, Object a, Object b, Integer orden) {
        try {
            Object valA, valB;
            if (atributo == null || atributo.isEmpty()) {
                valA = a;
                valB = b;
            } else {
                valA = a.getClass().getMethod("get" + capitalize(atributo)).invoke(a);
                valB = b.getClass().getMethod("get" + capitalize(atributo)).invoke(b);
            }
            int cmp;
            if (valA instanceof Number && valB instanceof Number) {
                Double da = ((Number) valA).doubleValue();
                Double db = ((Number) valB).doubleValue();
                cmp = da.compareTo(db);
            } else {
                cmp = valA.toString().compareTo(valB.toString());
            }
            if (orden == ASCENDENTE) {
                return cmp < 0;
            } else {
                return cmp > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String capitalize(String str) {
        if (str == null || str.isEmpty())
            return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
