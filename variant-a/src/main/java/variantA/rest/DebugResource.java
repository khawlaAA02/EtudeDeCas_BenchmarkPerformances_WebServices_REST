package variantA.rest;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.persistence.EntityManager;
import variantA.persistence.JPAUtil;

@Path("/debug")
public class DebugResource {

    @GET @Path("/db")
    @Produces(MediaType.TEXT_PLAIN)
    public Response db() {
        try (EntityManager em = JPAUtil.getEntityManager()) {
            Object c1 = em.createNativeQuery("select count(*) from category").getSingleResult();
            Object c2 = em.createNativeQuery("select count(*) from item").getSingleResult();
            long cat = ((Number) c1).longValue();
            long it  = ((Number) c2).longValue();
            return Response.ok("DB OK - category=" + cat + " item=" + it).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("DB ERROR: " + e.getMessage()).build();
        }
    }
}
