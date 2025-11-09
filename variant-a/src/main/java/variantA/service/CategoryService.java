package variantA.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import variantA.model.Category;
import variantA.model.Item;
import variantA.persistence.JPAUtil;

import java.util.List;
import java.util.Optional;

public class CategoryService {

    public List<Category> findAll(int page, int size) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Category> q = em.createQuery("SELECT c FROM Category c ORDER BY c.id", Category.class);
            q.setFirstResult(page * size);
            q.setMaxResults(size);
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public Optional<Category> findById(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Category c = em.find(Category.class, id);
            return Optional.ofNullable(c);
        } finally {
            em.close();
        }
    }

    public Category create(Category c) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(c);
            em.getTransaction().commit();
            return c;
        } catch (RuntimeException e) {
            em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public Optional<Category> update(Long id, Category payload) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Category existing = em.find(Category.class, id);
            if (existing == null) {
                em.getTransaction().rollback();
                return Optional.empty();
            }
            existing.setName(payload.getName());
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
            Category existing = em.find(Category.class, id);
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

    public List<Item> findItemsByCategory(Long categoryId, int page, int size) {
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
}
