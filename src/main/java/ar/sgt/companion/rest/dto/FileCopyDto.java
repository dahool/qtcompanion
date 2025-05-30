package ar.sgt.companion.rest.dto;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class FileCopyDto {

    public List<String> files;

    public String target;

}
