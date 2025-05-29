package ar.sgt.companion.services;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.subscription.MultiEmitter;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.sse.Sse;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.emitter.Emitter;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.ConcurrentLinkedQueue;

@ApplicationScoped
public class MessageService {

    private static final Logger LOG = LoggerFactory.getLogger(MessageService.class);

    // yes, I want this to be static!
    private static final Queue<String> messages = new ConcurrentLinkedQueue<>();

    private volatile MultiEmitter<? super String> emitter;

    @Inject
    private Sse sse;

    public void setEmitter(MultiEmitter<? super String> emitter) {
        this.emitter = emitter;
        if (this.emitter != null) {
            LOG.debug("Client connected");
            while (!messages.isEmpty()) {
                this.emitter.emit(messages.poll());
            }
        } else {
            LOG.debug("Client disconnected");
        }
    }

    public void addMessage(String message) {
        if (this.emitter != null && !this.emitter.isCancelled()) {
            LOG.debug("Broadcasting message {} to emitter", message);
            this.emitter.emit(message);
        } else {
            LOG.debug("Storing message {}", message);
            messages.add(message);
        }
    }

}
