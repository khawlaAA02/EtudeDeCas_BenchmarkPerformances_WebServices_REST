package variantC.dto;

public class ItemDTO {
    public Long id;
    public String sku;
    public String name;
    public double price;
    public int stock;
    public Long categoryId;

    public ItemDTO(Long id, String sku, String name, double price, int stock, Long categoryId) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.categoryId = categoryId;
    }
}
