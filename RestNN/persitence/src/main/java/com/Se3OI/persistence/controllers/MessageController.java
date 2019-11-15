package com.Se3OI.persistence.controllers;

import com.Se3OI.logic.handlers.MessageHandler;
import com.Se3OI.domain.models.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/message")
public class MessageController {
    private MessageHandler handler;

    public MessageController() {
    }

    @Autowired
    public MessageController(MessageHandler handler) {
        this.handler = handler;
    }


    @RequestMapping(value = "/",method = RequestMethod.POST)
    public Message create(@RequestBody Message msg) {
        return handler.create(msg);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.GET)
    public Message read(@PathVariable("id") Long id) {
        return handler.read(id);
    }

    @RequestMapping(value = "/",method = RequestMethod.GET)
    public List<Message> readAll() {
        return handler.readAll();
    }

    @RequestMapping(value = "/",method = RequestMethod.PUT)
    public Message update(@RequestBody Message msg) {
        return handler.update(msg);
    }

    @RequestMapping(value = "/",method = RequestMethod.DELETE)
    public boolean delete(Long id) {
        return handler.delete(id);
    }


}
