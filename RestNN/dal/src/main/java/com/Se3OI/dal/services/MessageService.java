package com.Se3OI.dal.services;

import com.Se3OI.domain.models.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import com.Se3OI.dal.repositories.MessageRepository;


@Service
public class MessageService {

    @Qualifier(value = "MessageRepository")
    @Autowired
    private MessageRepository repository;

    public Message create(Message msg) {return repository.save(msg);}

    public Message read(Long id) {
        return repository.findById(id).get();
    }

    public Iterable<Message> readAll(){
        return repository.findAll();
    }

    public Message update(Message msg) {
        return repository.save(msg);
    }

    public boolean delete(Long id) {
        repository.deleteById(id);
        return true;
    }
}
