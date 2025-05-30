package ar.sgt.companion.rest.dto;

import lombok.AllArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@ToString
public class MessageDto {

    public String type;

    public String message;

    public static MessageDto forError(String message) {
        return new MessageDto("error", message);
    }

    public static MessageDto forSuccess(String message) {
        return new MessageDto("success", message);
    }

}
