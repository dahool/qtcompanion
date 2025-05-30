package ar.sgt.companion.services;

import ar.sgt.companion.rest.dto.FileCopyDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class CopyEventListener {

    private static final Logger LOG = LoggerFactory.getLogger(CopyEventListener.class);

    @Inject
    private FileServices services;

    public void onFileCopyEvent(@Observes FileCopyDto dto) {
        services.copyFiles(dto);
    }

}
