package variantC.repo;

import variantC.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {

    // Traverse la propriété imbriquée "category.id"
    Page<Item> findByCategory_Id(Long categoryId, Pageable pageable);
}
