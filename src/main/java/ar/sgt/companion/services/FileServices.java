package ar.sgt.companion.services;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import ar.sgt.companion.rest.dto.FileCopyDto;
import io.quarkus.qute.i18n.Message;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ar.sgt.companion.rest.dto.FileItem;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FileServices {

    private static final Logger LOG = LoggerFactory.getLogger(FileServices.class);

    private ExecutorService executor = new ThreadPoolExecutor(5, 50, 30000, TimeUnit.MILLISECONDS, new SynchronousQueue<>(), new ThreadPoolExecutor.CallerRunsPolicy());

    @ConfigProperty(name = "path.base.target")
    private String baseTargetPath;

    @Inject
    private MailService mailService;

    @Inject
    private MessageService messages;

    public List<FileItem> listFileMatching(final File dir, final FilenameFilter filter) {

        LOG.info("Listing files on {}", dir);

        if (dir == null || !dir.isDirectory()) {
            return Collections.emptyList();
        }

        final List<FileItem> files = Arrays.stream(dir.list(filter))
                .parallel()
                .map(s -> new FileItem(new File(s).getName(), Paths.get(dir.getAbsolutePath(), s).toString()))
                .collect(Collectors.toList());

        File[] subDirs = dir.listFiles(File::isDirectory);

        final CompletionService<List<FileItem>> taskService = new ExecutorCompletionService<>(executor);
        for (File sDir : subDirs) {
            taskService.submit(() -> listFileMatching(sDir, filter));
        }

        int taskCount = subDirs.length;
        try {
            while (taskCount > 0) {
                Future<List<FileItem>> fTask = taskService.take();
                files.addAll(fTask.get());
                taskCount--;
            };
        } catch (InterruptedException e) {
            LOG.error("Process interrupted");
        } catch (ExecutionException e) {
            LOG.error("Execution error", e);
        }

        files.sort(Comparator.comparing(FileItem::getFilename));

        return files;

    }

    public List<FileItem> listFolderTree(final File dir) {

        LOG.info("Listing tree on {}", dir);

        if (dir == null || !dir.isDirectory()) {
            return Collections.emptyList();
        }

        File[] dirs = dir.listFiles(File::isDirectory);
        List<FileItem> list = new ArrayList<>();

        final CompletionService<FileItem> taskService = new ExecutorCompletionService<>(executor);
        for (File sDir : dirs) {
            taskService.submit(() -> {
                final FileItem ifn = new FileItem(sDir.getName(), sDir.getAbsolutePath());
                ifn.children = listFolderTree(sDir);
                return ifn;
            });
        }

        int taskCount = dirs.length;
        try {
            while (taskCount > 0) {
                Future<FileItem> fit = taskService.take();
                list.add(fit.get());
                taskCount--;
            }
        } catch (InterruptedException e) {
            LOG.error("Process interrupted");
        } catch (ExecutionException e) {
            LOG.error("Execution error", e);
        }

        list.sort(Comparator.comparing(FileItem::getFilename));

        return list;
    }

    public Boolean createDirectory(final String name, final String parent) {
        try {
            LOG.debug("Create directory {} in {}", name, parent);
            Files.createDirectory(Paths.get(parent, name));
            return true;
        } catch (IOException e) {
            LOG.error("Error creating directory", e);
            return false;
        }
    }

    public void copyFiles(final FileCopyDto dto) {
        executor.submit(() -> {
            final AtomicBoolean hasError = new AtomicBoolean(false);
            final StringBuilder b = new StringBuilder();
            dto.files.stream().map(Paths::get).forEach(file -> {
                try {
                    LOG.info("Copy {} to {}", file, dto.target);
                    Files.copy(file, Paths.get(dto.target, file.getFileName().toString()), StandardCopyOption.REPLACE_EXISTING,  StandardCopyOption.COPY_ATTRIBUTES);
                    b.append("Copied ").append(file).append("\n");
                    LOG.debug("Copied {}", file);
                    messages.addMessage("Copied " + file);
                } catch (IOException e) {
                    hasError.set(true);
                    b.append("Error copying ").append(file).append(": ").append(e.getMessage()).append("\n");
                    LOG.error("Error copying file", e);
                    messages.addMessage("Error copying " + file);
                }
            });
            mailService.sendMail(
                    "Copy Files Complete" + (hasError.get() ? " with errors" : ""),
                        b.toString());
        });
    }

}
