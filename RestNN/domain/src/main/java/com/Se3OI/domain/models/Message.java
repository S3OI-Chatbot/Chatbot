package com.Se3OI.domain.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;


import javax.persistence.*;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    @JsonSerialize
    private Long id;
    @Getter
    @JsonSerialize
    private String message;

    public Message() {
    }

    public Message(String message) {
        this.message = message;
    }
}
