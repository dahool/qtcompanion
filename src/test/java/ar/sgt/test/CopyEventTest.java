package ar.sgt.test;

import ar.sgt.companion.rest.dto.FileCopyDto;
import ar.sgt.companion.services.FileServices;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@QuarkusTest
public class CopyEventTest {

    @Inject
    Event<FileCopyDto> fileCopyDtoEvent;

    @InjectMock
    FileServices mockFileServices;

    @Test
    void fileCopyEventTest() {
        FileCopyDto dto1 = new FileCopyDto(Arrays.asList("file1"), "dest1");
        FileCopyDto dto2 = new FileCopyDto(Arrays.asList("file2"), "dest2");

        fileCopyDtoEvent.fire(dto1);
        fileCopyDtoEvent.fire(dto2);

        verify(mockFileServices, times(1)).copyFiles(dto1);
        verify(mockFileServices, times(1)).copyFiles(dto2);
        verify(mockFileServices, times(2)).copyFiles(any(FileCopyDto.class));
    }

}
