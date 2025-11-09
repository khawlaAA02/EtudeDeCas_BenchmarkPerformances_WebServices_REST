package variantA.rest;

import variantA.infra.Jpa;
import variantA.model.Item;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.time.Instant;
import java.util.List;

@Path("/items")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ItemResource {

    @GET
    public List<Item> list(@QueryParam("categoryId") Long categoryId,
                           @QueryParam("page") @DefaultValue("0") int page,
                           @QueryParam("size") @DefaultValue("50") int size) {
        EntityManager em = Jpa.em();
        try {
            String jpql = (categoryId == null)
                    ? "select i from Item i order by i.id"
                    : "select i from Item i where i.category.id = :cid order by i.id";
            TypedQuery<Item> q = em.createQuery(jpql, Item.class);
            if (categoryId != null) q.setParameter("cid", categoryId);
            q.setFirstResult(page * size);
            q.setMaxResults(size);
            return q.getResultList();
        } finally { em.close(); }
    }

    @GET @Path("/{id}")
    public Item get(@PathParam("id") Long id) {
        EntityManager em = Jpa.em();
        try { return em.find(Item.class, id); }
        finally { em.close(); }
    }

    @POST
    public Item create(Item in) {
        EntityManager em = Jpa.em();
        try {
            em.getTransaction().begin();
            em.persist(in);
            em.getTransaction().commit();
            return in;
        } finally { em.close(); }
    }

    @PUT @Path("/{id}")
    public Item update(@PathParam("id") Long id, Item in) {
        EntityManager em = Jpa.em();
        try {
            em.getTransaction().begin();
            Item i = em.find(Item.class, id);
            i.setName(in.getName());
            i.setSku(in.getSku());
            i.setPrice(in.getPrice());
            i.setStock(in.getStock());
            i.setCategory(in.getCategory());
            i.setUpdatedAt(Instant.now());
            em.getTransaction().commit();
            return i;
        } finally { em.close(); }
    }

    @DELETE @Path("/{id}")
    public void delete(@PathParam("id") Long id) {
        EntityManager em = Jpa.em();
        try {
            em.getTransaction().begin();
            Item i = em.find(Item.class, id);
            em.remove(i);
            em.getTransaction().commit();
        } finally { em.close(); }
    }
}
