package ar.sgt.companion.services;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ar.sgt.companion.rest.dto.MessageDto;
import io.smallrye.mutiny.subscription.MultiEmitter;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MessageService {

    private static final Logger LOG = LoggerFactory.getLogger(MessageService.class);

    private final Queue<MessageDto> messages = new ConcurrentLinkedQueue<>();

    private volatile MultiEmitter<? super MessageDto> emitter;

    public void setEmitter(MultiEmitter<? super MessageDto> emitter) {
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

    public void addMessage(MessageDto message) {
        if (this.emitter != null && !this.emitter.isCancelled()) {
            LOG.debug("Broadcasting message {} to emitter", message);
            this.emitter.emit(message);
        } else {
            LOG.debug("Storing message {}", message);
            messages.add(message);
        }
    }

}
