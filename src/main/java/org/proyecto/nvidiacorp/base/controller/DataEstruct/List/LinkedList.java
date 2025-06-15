package org.proyecto.nvidiacorp.base.controller.DataEstruct.List;

import java.util.HashMap;

import org.proyecto.nvidiacorp.base.controller.DataEstruct.stack.Stack;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.utils.Utiles_login;

public class LinkedList<E> {
    private Node<E> header;
    private Node<E> last;
    private Integer length;

    
    public Integer getLength() {
        return this.length;
    }
    
    public LinkedList() {
        header = null;
        last = null;
        length = 0;
    }

    public Boolean isEmpty() {
        return header == null || length == 0;
    }

    private Node<E> getNode(Integer pos) {
        if (isEmpty()) {
            throw new ArrayIndexOutOfBoundsException("List empty");
            // System.out.println("Lista vacia");
            // return null;
        } else if (pos < 0 || pos >= length) {
            // System.out.println("Fuera de rango");
            // return null;
            throw new ArrayIndexOutOfBoundsException("Index out range");
        }else if (pos == 0) {
            return header;
        } else if ((length.intValue()- 1) == pos.intValue()) {
            return last;
        } else {
            Node<E> search = header;
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
            return header.getData();
        }    
    }

    private E getDataLast() {
        if (isEmpty()) {
            throw new ArrayIndexOutOfBoundsException("List empty");
        } else {
            return last.getData();
        }    
    }

    public E get(Integer pos)  {
        return getNode(pos).getData();
        /*if (isEmpty()) {
            throw new ArrayIndexOutOfBoundsException("List empty");
            // System.out.println("Lista vacia");
            // return null;
        } else if (pos < 0 || pos >= length) {
            // System.out.println("Fuera de rango");
            // return null;
            throw new ArrayIndexOutOfBoundsException("Index out range");
        }else if (pos == 0) {
            return getDataFirst();
        } else if (length.intValue() == pos.intValue()) {
            return getDataLast();
        } else {
            return getNode(pos).getData();
        }*/
    }

    private void addFirst(E data) {
        if (isEmpty()) {
            Node<E> aux = new Node<>(data);
            header = aux;
            last = aux;
        } else {
            Node<E> header_old = header;
            Node<E> aux = new Node<>(data, header_old);
            header = aux;
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
            Node<E> help = header;
            while (help != null) {
                // resp += help.getData()+" - ";
                resp.append(help.getData()).append(" - ");
                help = help.getNext();
            }
            resp.append("\n");
            return resp.toString();
        }
    }

    public void update(E data, Integer pos){
        
        getNode(pos).setData(data);
        
    }


/// QUICKSORT////////////////////////////////////////////////////////////////////////////////////
    public LinkedList<E> quickSort(String atributo, Integer orden,  HashMap<String, AdapterDao> daos ) throws Exception {
        if(isEmpty()) {
            return this;
        }

        E[] array = this.toArray();
        final Integer high = array.length - 1;
        final Integer low = 0;

        quickSort(atributo, array, low, high, orden,daos);

        clear();
        for(E e : array){
            add(e);
        }

        return this;
    }

    private void quickSort(String atributo, E[] array, Integer low, Integer high, Integer orden, HashMap<String, AdapterDao> daos ) throws Exception {
        if(low < high) {
            int pivoteIndex = partir(atributo,array,low,high,orden,daos);
            
            quickSort(atributo, array, low, pivoteIndex - 1, orden,daos);
            quickSort(atributo, array, pivoteIndex + 1, high, orden,daos);
        }
    }

    private Integer partir(String atributo,E[] array, Integer low, Integer high, Integer orden, HashMap<String, AdapterDao> daos ) throws Exception {
        Utiles_login util = new Utiles_login();
        E pivote = array[high];

        Integer j = low - 1;

        for (int i = low; i <= high-1; i++) {
            if(util.compararAtributos(atributo,array[i],pivote,orden,daos)) {
                j++;
                intercambio(array,j,i);
            }
        }

        intercambio(array, j + 1, high);

        return j + 1;
    }

    private void intercambio(E[] array, Integer i, Integer j) {
        E temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
//////// FIN QUICKSORT //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    public void clear() {
        header = null;
        last = null;
        length = 0;
    }

    public E[] toArray() {
        Class clazz = null;
        E[] matriz = null;
        if(this.length > 0) {
            clazz = header.getData().getClass();
            matriz = (E[]) java.lang.reflect.Array.newInstance(clazz, this.length);
            Node<E> aux = header;
            for(int i = 0; i < length; i++) {
                matriz[i] = aux.getData();
                aux = aux.getNext();
            }
        }
        return matriz;
    }

    public LinkedList<E> toList(E[] matriz) {
        clear();
        for(int i = 0; i < matriz.length; i++) {
            this.add(matriz[i]);
        }
        return this;
    }

    protected E deleteFirst() throws Exception {
        if(isEmpty()) {
            throw new Exception("List empty");
        } else {
            E element = header.getData();
            Node<E> aux = header.getNext();
            header = aux;
            if(length.intValue() == 1)
                last = null;
            length--;
            return element;
        }
    }

    protected E deleteLast() throws Exception {
        if(isEmpty()) {
            throw new Exception("List empty");
        } else {
            E element = last.getData();
            Node<E> aux = getNode(length - 2);            
            if(aux == null){
                last = null;
                if(length == 2) {
                    last = header;
                } else {
                    header = null;
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
        }else if (pos == 0) {
            return deleteFirst();
        } else if ((length.intValue()- 1) == pos.intValue()) {
            return deleteLast();
        } else {
            Node<E> preview = getNode(pos -1);
            Node<E> actualy = getNode(pos);
            E element = preview.getData();
            Node<E> next = actualy.getNext();
            actualy = null;
            preview.setNext(next);
            length--;
            return element;
        }
    }
    
    public void deleteById(Integer id) throws Exception{
        Utiles_login util = new Utiles_login();

        for(int i = 0; i < length ; i++){
            
            if(util.getClazz(getNode(i).getData(), "id").equals(id)){
                if (i == 0) {
                    header = header.getNext(); // eliminar el primero
                } else {
                    Node<E> previo = getNode(i - 1);
                    previo.setNext(getNode(i).getNext());
                }
                length--;
                break;
            }
        }
    }

    public static void main(String[] args) {
        //StackImplementation<Integer> si = new StackImplementation<>(5);
        Stack<Integer> stack = new Stack<>(5);
        
    }

}
