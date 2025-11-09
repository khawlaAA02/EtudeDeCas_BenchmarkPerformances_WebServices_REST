package variantA.mapper;

import variantA.model.Item;
import variantA.dto.ItemDTO;

public class ItemMapper {

    public static ItemDTO toDTO(Item item) {
        if (item == null) return null;

        Long categoryId = (item.getCategory() != null) ? item.getCategory().getId() : null;

        return new ItemDTO(
                item.getId(),
                item.getSku(),
                item.getName(),
                item.getPrice(),
                item.getStock(),
                categoryId
        );
    }
}
