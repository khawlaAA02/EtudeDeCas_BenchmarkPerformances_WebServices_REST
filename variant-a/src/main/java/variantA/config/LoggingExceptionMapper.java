package variantA.config;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class LoggingExceptionMapper implements ExceptionMapper<Throwable> {
    @Override
    public Response toResponse(Throwable ex) {
        System.err.println("=== JAX-RS ERROR ===");
        ex.printStackTrace(); // < stacktrace dans ta console java -jar
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Server error: " + ex.getClass().getSimpleName() + " - " + ex.getMessage())
                .type("text/plain")
                .build();
    }
}
