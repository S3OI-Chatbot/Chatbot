package com.Se3OI.logic.handlers;

import com.Se3OI.logic.components.MessageComponent;
import lombok.Setter;
import com.Se3OI.domain.models.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.Se3OI.dal.services.MessageService;

import java.util.ArrayList;
import java.util.List;

@Component
public class MessageHandler {

    @Setter
    private MessageComponent component;

    @Setter
    private MessageService service;

    public MessageHandler() {
    }

    @Autowired
    public MessageHandler(MessageComponent component, MessageService service) {
        this.component = component;
        this.service = service;
    }

    public Message create(Message message) {
        return service.create(message);
    }

    public Message read(Long id) {
        return service.read(id);
    }

    public List<Message> readAll() {
        Iterable<Message> messages = service.readAll();
        List<Message> messageList = new ArrayList<>();

        messages.iterator().forEachRemaining(messageList::add);
        return messageList;
    }

    public Message update(Message message) {
        return service.update(message);
    }

    public boolean delete(Long id) {
        return service.delete(id);
    }
}
