package org.proyecto.nvidiacorp.base.controller.DataEstruct.List;

// V,K -- KEY VALUE
// E -- COLEECIONES
//T--  DATOS GENERICOS

public class Node <E>{
    private E data;
    private Node<E> next;

    public Node(E data, Node<E> next) {
        this.data = data;
        this.next = next;
    }

    public Node(E data) {
        this.data = data;
        this.next = null;
    }

    public Node () {
        this.data = null;
        this.next = null;
    }

    public E getData() {
      return this.data;
    }
    public void setData(E value) {
      this.data = value;
    }

    public Node<E> getNext() {
      return this.next;
    }
    public void setNext(Node<E> value) {
      this.next = value;
    }
}