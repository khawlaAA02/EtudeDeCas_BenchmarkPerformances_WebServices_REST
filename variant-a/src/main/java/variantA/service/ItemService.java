package variantA.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import variantA.model.Category;
import variantA.model.Item;
import variantA.persistence.JPAUtil;

import java.util.List;
import java.util.Optional;

public class ItemService {

    public List<Item> findAll(int page, int size) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Item> q = em.createQuery("SELECT i FROM Item i ORDER BY i.id", Item.class);
            q.setFirstResult(page * size);
            q.setMaxResults(size);
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Item> findByCategory(Long categoryId, int page, int size) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Item> q = em.createQuery(
                    "SELECT i FROM Item i WHERE i.category.id = :cid ORDER BY i.id", Item.class);
            q.setParameter("cid", categoryId);
            q.setFirstResult(page * size);
            q.setMaxResults(size);
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public Optional<Item> findById(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Item i = em.find(Item.class, id);
            return Optional.ofNullable(i);
        } finally {
            em.close();
        }
    }

    public Item create(Item i, Long categoryId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            if (categoryId != null) {
                Category c = em.find(Category.class, categoryId);
                if (c != null) i.setCategory(c);
            }
            em.persist(i);
            em.getTransaction().commit();
            return i;
        } catch (RuntimeException e) {
            em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public Optional<Item> update(Long id, Item payload, Long categoryId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Item existing = em.find(Item.class, id);
            if (existing == null) {
                em.getTransaction().rollback();
                return Optional.empty();
            }
            existing.setName(payload.getName());
            existing.setPrice(payload.getPrice());
            existing.setStock(payload.getStock());
            if (categoryId != null) {
                Category c = em.find(Category.class, categoryId);
                existing.setCategory(c);
            }
            em.merge(existing);
            em.getTransaction().commit();
            return Optional.of(existing);
        } catch (RuntimeException e) {
            em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public boolean delete(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Item existing = em.find(Item.class, id);
            if (existing == null) {
                em.getTransaction().rollback();
                return false;
            }
            em.remove(existing);
            em.getTransaction().commit();
            return true;
        } catch (RuntimeException e) {
            em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}
