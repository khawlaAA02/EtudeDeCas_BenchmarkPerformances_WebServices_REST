package variantA.rest;

import variantA.infra.Jpa;
import variantA.model.Category;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.time.Instant;
import java.util.List;

@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoryResource {

    @GET
    public List<Category> list(@QueryParam("page") @DefaultValue("0") int page,
                               @QueryParam("size") @DefaultValue("50") int size) {
        EntityManager em = Jpa.em();
        try {
            TypedQuery<Category> q = em.createQuery("select c from Category c order by c.id", Category.class);
            q.setFirstResult(page * size);
            q.setMaxResults(size);
            return q.getResultList();
        } finally { em.close(); }
    }

    @GET @Path("/{id}")
    public Category get(@PathParam("id") Long id) {
        EntityManager em = Jpa.em();
        try { return em.find(Category.class, id); }
        finally { em.close(); }
    }

    @POST
    public Response create(Category c) {
        EntityManager em = Jpa.em();
        try {
            em.getTransaction().begin();
            em.persist(c);
            em.getTransaction().commit();
            return Response.status(201).entity(c).build();
        } finally { em.close(); }
    }

    @PUT @Path("/{id}")
    public Category update(@PathParam("id") Long id, Category in) {
        EntityManager em = Jpa.em();
        try {
            em.getTransaction().begin();
            Category c = em.find(Category.class, id);
            c.setCode(in.getCode());
            c.setName(in.getName());
            c.setUpdatedAt(Instant.now());
            em.getTransaction().commit();
            return c;
        } finally { em.close(); }
    }

    @DELETE @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        EntityManager em = Jpa.em();
        try {
            em.getTransaction().begin();
            Category c = em.find(Category.class, id);
            em.remove(c);
            em.getTransaction().commit();
            return Response.noContent().build();
        } finally { em.close(); }
    }
}
