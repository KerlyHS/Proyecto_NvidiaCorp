package org.proyecto.nvidiacorp.base.controller.DataEstruct.List;

import org.proyecto.nvidiacorp.base.controller.Utiles;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.stack.Stack;

import java.util.stream.StreamSupport;
import java.util.stream.Stream;

public class LinkedList<E> {
    private Node<E> head;
    private Node<E> last;
    private Integer length;

    public Integer getLength() {
        return this.length;
    }

    public LinkedList() {
        head = null;
        last = null;
        length = 0;
    }

    public Boolean isEmpty() {
        return head == null || length == 0;
    }

    private Node<E> getNode(Integer pos) {
        if (isEmpty()) {
            throw new ArrayIndexOutOfBoundsException("List empty");
        } else if (pos < 0 || pos >= length) {
            throw new ArrayIndexOutOfBoundsException("Index out range");
        } else if (pos == 0) {
            return head;
        } else if ((length.intValue() - 1) == pos.intValue()) {
            return last;
        } else {
            Node<E> search = head;
            Integer cont = 0;
            while (cont < pos) {
                cont++;
                search = search.getNext();
            }
            return search;
        }
    }

    private E getDataFirst() {
        if (isEmpty()) {
            throw new ArrayIndexOutOfBoundsException("List empty");
        } else {
            return head.getData();
        }
    }

    private E getDataLast() {
        if (isEmpty()) {
            throw new ArrayIndexOutOfBoundsException("List empty");
        } else {
            return last.getData();
        }
    }

    public E get(Integer pos) {
        return getNode(pos).getData();
    }

    private void addFirst(E data) {
        if (isEmpty()) {
            Node<E> aux = new Node<>(data);
            head = aux;
            last = aux;
        } else {
            Node<E> head_old = head;
            Node<E> aux = new Node<>(data, head_old);
            head = aux;
        }
        length++;
    }

    private void addLast(E data) {
        if (isEmpty()) {
            addFirst(data);
        } else {
            Node<E> aux = new Node<>(data);
            last.setNext(aux);
            last = aux;
            length++;
        }

    }

    public void add(E data, Integer pos) throws Exception {
        if (pos == 0) {
            addFirst(data);
        } else if (length.intValue() == pos.intValue()) {
            addLast(data);
        } else {
            Node<E> search_preview = getNode(pos - 1);
            Node<E> search = getNode(pos);
            Node<E> aux = new Node<>(data, search);
            search_preview.setNext(aux);
            length++;
        }
    }

    public void add(E data) {
        addLast(data);
    }

    public String print() {
        if (isEmpty())
            return "Esta vacia";
        else {
            StringBuilder resp = new StringBuilder();
            Node<E> help = head;
            while (help != null) {
                resp.append(help.getData()).append(" - ");
                help = help.getNext();
            }
            resp.append("\n");
            return resp.toString();
        }
    }

    public void update(E data, Integer pos) {
        getNode(pos).setData(data);
    }

    public void clear() {
        head = null;
        last = null;
        length = 0;
    }

    public E[] toArray() {
        Class clazz = null;
        E[] matriz = null;
        if (this.length > 0) {
            clazz = head.getData().getClass();
            matriz = (E[]) java.lang.reflect.Array.newInstance(clazz, this.length);
            Node<E> aux = head;
            for (int i = 0; i < length; i++) {
                matriz[i] = aux.getData();
                aux = aux.getNext();
            }
        }
        return matriz;
    }

    public LinkedList<E> toList(E[] matriz) {
        clear();
        for (int i = 0; i < matriz.length; i++) {
            this.add(matriz[i]);
        }
        return this;
    }

    protected E deleteFirst() throws Exception {
        if (isEmpty()) {
            throw new Exception("List empty");
        } else {
            E element = head.getData();
            Node<E> aux = head.getNext();
            head = aux;
            if (length.intValue() == 1)
                last = null;
            length--;
            return element;
        }
    }

    protected E deleteLast() throws Exception {
        if (isEmpty()) {
            throw new Exception("List empty");
        } else {
            E element = last.getData();
            Node<E> aux = getNode(length - 2);
            if (aux == null) {
                last = null;
                if (length == 2) {
                    last = head;
                } else {
                    head = null;
                }
            } else {
                last = null;
                last = aux;
                last.setNext(null);
            }
            length--;
            return element;
        }
    }

    public E delete(Integer pos) throws Exception {
        if (isEmpty()) {
            throw new ArrayIndexOutOfBoundsException("List empty");

        } else if (pos < 0 || pos >= length) {
            throw new ArrayIndexOutOfBoundsException("Index out range");
        } else if (pos == 0) {
            return deleteFirst();
        } else if ((length.intValue() - 1) == pos.intValue()) {
            return deleteLast();
        } else {
            Node<E> preview = getNode(pos - 1);
            Node<E> actualy = getNode(pos);
            E element = preview.getData();
            Node<E> next = actualy.getNext();
            actualy = null;
            preview.setNext(next);
            length--;
            return element;
        }
    }

    public Stream<E> stream() {
        return StreamSupport.stream(java.util.Spliterators.spliterator(this.toArray(), 0), false);
    }

    // QuickSort

    public void quickSort(String attribute, Integer type) {
        E[] arr = this.toArray();
        quick(arr, 0, arr.length - 1, attribute, type);
        this.toList(arr);
    }

    private void quick(E[] arr, int begin, int end, String attribute, Integer type) {
        if (begin < end) {
            int partitionIndex = partition(arr, begin, end, attribute, type);
            quick(arr, begin, partitionIndex - 1, attribute, type);
            quick(arr, partitionIndex + 1, end, attribute, type);
        }
    }

    private int partition(E[] arr, int begin, int end, String attribute, Integer type) {
        Utiles util = new Utiles();
        Object pivotValue = getComparar(arr[end], attribute, util);
        int i = begin - 1;
        for (int j = begin; j < end; j++) {
            Object currentValue = getComparar(arr[j], attribute, util);
            int cmp = comparar(currentValue, pivotValue);
            if ((type == Utiles.ASCENDENTE && cmp < 0) || (type != Utiles.ASCENDENTE && cmp > 0)) {
                i++;
                E temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        E temp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = temp;
        return i + 1;
    }

    private Object getComparar(E obj, String attribute, Utiles util) {
        if (attribute == null || attribute.isEmpty()) {
            return obj;
        }
        try {
            return obj.getClass().getMethod("get" + util.capitalize(attribute)).invoke(obj);
        } catch (Exception e) {
            return obj;
        }
    }

    private int comparar(Object a, Object b) {
        if (a == null && b == null)
            return 0;
        if (a == null)
            return -1;
        if (b == null)
            return 1;
        if (a instanceof Number && b instanceof Number) {
            Double da = ((Number) a).doubleValue();
            Double db = ((Number) b).doubleValue();
            return da.compareTo(db);
        }
        if (a instanceof Comparable && b instanceof Comparable) {
            return ((Comparable) a).compareTo(b);
        }
        return a.toString().compareTo(b.toString());
    }

    // ShellSort
    public LinkedList<E> shellSort(String attribute, Integer orden) throws Exception {
        if (isEmpty())
            return this;

        E[] array = this.toArray();
        Utiles util = new Utiles();
        int n = array.length;

        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                E temp = array[i];
                int j;
                for (j = i; j >= gap && !util.compararAtributos(attribute, array[j - gap], temp, orden); j -= gap) {
                    array[j] = array[j - gap];
                }
                array[j] = temp;
            }
        }
        return this.toList(array);
    }

    // Busqueda Lineal
    public LinkedList<E> busquedaLineal(String attribute, String text, Integer type) {
        LinkedList<E> resp = new LinkedList<>();
        if (!isEmpty()) {
            E[] arr = this.toArray();
            Utiles util = new Utiles();
            for (int i = 0; i < arr.length; i++) {
                try {
                    Object valor = arr[i].getClass().getMethod("get" + util.capitalize(attribute)).invoke(arr[i]);
                    if (valor != null) {
                        String valorStr = valor.toString().toLowerCase();
                        String textoStr = text.toLowerCase();
                        switch (type) {
                            case 1:
                                if (valorStr.startsWith(textoStr)) {
                                    resp.add(arr[i]);
                                }
                                break;
                            case 2:
                                if (valor instanceof Number && textoStr.matches("\\d+")) {
                                    if (valorStr.equals(textoStr)) {
                                        resp.add(arr[i]);
                                    }
                                } else {
                                    if (valorStr.contains(textoStr)) {
                                        resp.add(arr[i]);
                                    }
                                }
                                break;
                            default:
                                switch (attribute) {
                                    case "precio":
                                        try {
                                            double valorDouble = Double.parseDouble(valorStr);
                                            double textoDouble = Double.parseDouble(textoStr);
                                            if (Double.compare(valorDouble, textoDouble) == 0) {
                                                resp.add(arr[i]);
                                            }
                                        } catch (NumberFormatException e) {
                                        }
                                        break;
                                    default:
                                        if (valorStr.contains(textoStr)) {
                                            resp.add(arr[i]);
                                        }
                                        break;
                                }
                                break;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return resp;
    }

    // Busqueda Binaria

    public LinkedList<E> busquedaBinaria(String attribute, String text, Integer type) {
        LinkedList<E> resp = new LinkedList<>();
        if (isEmpty())
            return resp;
        this.quickSort(attribute, type);
        E[] arr = this.toArray();
        Utiles util = new Utiles();
        int low = 0, high = arr.length - 1;
        int found = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            Object valor = getComparar(arr[mid], attribute, util);
            String valorStr = valor != null ? valor.toString().toLowerCase() : "";
            String textoStr = text.toLowerCase();
            int cmp = valorStr.compareTo(textoStr);
            if (cmp == 0) {
                found = mid;
                break;
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        if (found != -1) {
            int i = found;
            while (i >= 0) {
                Object valor = getComparar(arr[i], attribute, util);
                String valorStr = valor != null ? valor.toString().toLowerCase() : "";
                String textoStr = text.toLowerCase();
                if (valorStr.equals(textoStr)) {
                    resp.addFirst(arr[i]);
                    i--;
                } else {
                    break;
                }
            }
            int j = found + 1;
            while (j < arr.length) {
                Object valor = getComparar(arr[j], attribute, util);
                String valorStr = valor != null ? valor.toString().toLowerCase() : "";
                String textoStr = text.toLowerCase();
                if (valorStr.equals(textoStr)) {
                    resp.add(arr[j]);
                    j++;
                } else {
                    break;
                }
            }
        }
        return resp;
    }

    // Busqueda Lineal Binaria
    public LinkedList<E> busquedaLinealBinaria(String attribute, String text, Integer type) {
        this.quickSort(attribute, type);
        LinkedList<E> resultado = this.busquedaBinaria(attribute, text, type);
        if (resultado.isEmpty()) {
            resultado = this.busquedaLineal(attribute, text, type);
        }

        return resultado;
    }
    public static void main(String[] args) {
        //StackImplementation<Integer> si = new StackImplementation<>(5);
        Stack<Integer> stack = new Stack<>(5);
        
    }

}
