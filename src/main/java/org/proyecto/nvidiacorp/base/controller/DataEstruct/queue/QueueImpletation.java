package org.proyecto.nvidiacorp.base.controller.DataEstruct.queue;


import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;

public class QueueImpletation <E> extends LinkedList<E>{
    private Integer top;

    public QueueImpletation(Integer top){
        this.top = top;
    }

    protected Boolean isFullQueue(){
        return this.top >= getLength();
    }

    protected void push (E info)throws Exception{
        if (!isFullQueue()){
            add(info);
        }else{
            throw new ArrayIndexOutOfBoundsException("Queque is full");
         }
    }
    protected E dequeue()throws Exception{
        return deleteFirst();  
    }

    public Integer getTop() {
      return this.top;
    }
    
}