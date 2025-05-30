package ar.sgt.companion.rest;

import java.io.File;
import java.io.FilenameFilter;
import java.util.List;

import ar.sgt.companion.rest.dto.FileCopyDto;
import ar.sgt.companion.rest.dto.MessageDto;
import ar.sgt.companion.rest.dto.MkDirDto;
import ar.sgt.companion.services.MessageService;
import io.smallrye.mutiny.Multi;
import jakarta.enterprise.event.Event;
import jakarta.ws.rs.*;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import ar.sgt.companion.rest.dto.FileItem;
import ar.sgt.companion.services.FileServices;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestStreamElementType;

@Path("/files")
public class FileServiceController {

    @Inject
    private FileServices fileServices;

    @ConfigProperty(name = "path.base.source")
    private String baseSourcePath;

    @ConfigProperty(name = "path.base.target")
    private String baseTargetPath;

    @Inject
    private MessageService messages;

    @Inject
    private Event<FileCopyDto> fileCopyDtoEvent;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("source")
    public List<FileItem> listSourceFiles() {
        return this.fileServices.listFileMatching(new File(baseSourcePath), new FilenameFilter() {
            public boolean accept(File dir, String name) {
                return name.endsWith(".mp4") || name.endsWith(".mkv") || name.endsWith(".srt");
            }
        });
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("target")
    public FileItem listTargetTree() {
        final File file = new File(baseTargetPath);
        final FileItem item = new FileItem(file.getName(), file.getAbsolutePath());
        item.children = this.fileServices.listFolderTree(file);
        return item;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void copyFiles(FileCopyDto dto) {
        //fileServices.copyFiles(dto);
        fileCopyDtoEvent.fire(dto);
    }

    @GET
    @RestStreamElementType(MediaType.APPLICATION_JSON)
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @Path("messages")
    public Multi<MessageDto> listMessages() {
        return Multi.createFrom()
                        .emitter(e -> {
                            messages.setEmitter(e);
                            e.onTermination(() -> messages.setEmitter(null));
                        });
    }

    @GET
    @Path("test-message")
    public void sendTestMessage() {
        messages.addMessage(new MessageDto("info", "This is a test broadcast message"));
    }

    @PUT
    @Path("mkdir")
    public Boolean createDirectory(MkDirDto dto) {
        return fileServices.createDirectory(dto.name, dto.parent);
    }

}
