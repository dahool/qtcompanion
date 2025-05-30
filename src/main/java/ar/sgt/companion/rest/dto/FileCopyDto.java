package ar.sgt.companion.rest.dto;

import lombok.AllArgsConstructor;
import lombok.ToString;

import java.util.List;

@AllArgsConstructor
@ToString
public class FileCopyDto {

    public List<String> files;

    public String target;

}
