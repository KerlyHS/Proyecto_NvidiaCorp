package org.proyecto.nvidiacorp.base.controller.DataEstruct.stack;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;

public class StackImplementation<E> extends LinkedList<E> {
    private Integer top;

    public Integer getTop() {
        return this.top;
    }

    public StackImplementation(Integer top){
        this.top = top;
    }

    protected Boolean isFullStack() {
        return getLength() > this.top;

        // revisar
    }

    protected void push(E info) throws Exception {
        if(!isFullStack()) {
            add(info, 0);
        } else {
            throw new ArrayIndexOutOfBoundsException("Stack full");
        }
    }
    protected E pop() throws Exception {       
        return deleteFirst();
        
    }
}
