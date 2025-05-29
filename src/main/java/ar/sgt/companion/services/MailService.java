package ar.sgt.companion.services;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MailService {

    @Inject
    private Mailer mailer;

    @ConfigProperty(name="mailer.recipient")
    private String recipient;

    @ConfigProperty(name="mailer.address")
    private String fromAddr;

    public void sendMail(String subject, String text) {
        mailer.send(Mail.withText(recipient, subject, text).setFrom(fromAddr));
    }

}
