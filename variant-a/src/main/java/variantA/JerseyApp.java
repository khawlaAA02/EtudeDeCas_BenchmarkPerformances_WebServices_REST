package variantA;

import variantA.rest.CategoryResource;
import variantA.rest.ItemResource;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import java.net.URI;

public class JerseyApp {
    public static void main(String[] args) {
        ResourceConfig rc = new ResourceConfig()
                .register(CategoryResource.class)
                .register(ItemResource.class)
                .packages("com.fasterxml.jackson.jakarta.rs.json");
        String base = System.getenv().getOrDefault("APP_URL", "http://0.0.0.0:8081/");
        HttpServer server = GrizzlyHttpServerFactory.createHttpServer(URI.create(base), rc);
        System.out.println("Jersey started on " + base);
    }
}
