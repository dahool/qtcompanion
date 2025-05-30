package ar.sgt.companion.services;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@ApplicationScoped
public class LibraryRefreshService {

    private static final Logger LOG = LoggerFactory.getLogger(LibraryRefreshService.class);

    @ConfigProperty(name="library.url")
    private String libraryUrl;

    @ConfigProperty(name="library.token")
    private String libraryToken;

    private final HttpClient httpClient;

    public LibraryRefreshService() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public void requestLibraryRefresh() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(libraryUrl))
                .header("Authorization", "MediaBrowser Token=" + libraryToken)
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        try {
            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());
            if (response.statusCode() == 204) {
                LOG.info("Library refresh success");
            } else {
                LOG.error("Library refresh failed with {}", response.statusCode());
            }
        } catch (Exception e) {
            LOG.error("Library refresh failed", e);
        }
    }
}
