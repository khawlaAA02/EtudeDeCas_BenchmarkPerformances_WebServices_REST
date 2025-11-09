// variantC/repo/CategoryRepository.java
package variantC.repo;
import variantC.model.Category;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("select c from Category c left join fetch c.items where c.id=:id")
    Category findWithItems(@Param("id") Long id);

    @Query("select distinct c from Category c")
    List<Category> findPage(org.springframework.data.domain.Pageable p);
}
