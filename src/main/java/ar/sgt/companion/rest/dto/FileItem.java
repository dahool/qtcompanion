package ar.sgt.companion.rest.dto;

import lombok.Getter;

import java.util.List;

public class FileItem {

    @Getter
    public String filename;

    public String absoluteFile;

    public List<FileItem> children;

    public FileItem(String filename, String absoluteFile) {
        this.filename = filename;
        this.absoluteFile = absoluteFile;
    }

}
