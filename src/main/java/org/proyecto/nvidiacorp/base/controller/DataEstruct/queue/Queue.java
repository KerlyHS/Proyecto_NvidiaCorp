package org.proyecto.nvidiacorp.base.controller.DataEstruct.queue;

public class Queue <E>{
    private QueueImpletation <E> Queue;
    public Queue(Integer top){
        Queue = new QueueImpletation<>(top);
    }
    public Boolean push(E data)throws Exception{
        try {
            Queue.push(data);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public E dequeue(){
        try {
            return Queue.dequeue();
        } catch (Exception e) {
            return null;
        }
    }
    public Boolean isFullQueue(){
        return Queue.isFullQueue();
    }
    public Integer Top(){
        return Queue.getTop();
    }
    public Integer size (){
        return Queue.getLength();
    }
}
