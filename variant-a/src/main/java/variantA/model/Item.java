package variantA.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="item")
public class Item {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, unique=true, length=64)
    private String sku;
    @Column(nullable=false, length=128)
    private String name;
    @Column(nullable=false)
    private double price;
    @Column(nullable=false)
    private int stock;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="category_id", nullable=false)
    private Category category;
    @Column(name="updated_at", nullable=false)
    private Instant updatedAt = Instant.now();

    public Long getId(){return id;}
    public String getSku(){return sku;} public void setSku(String s){this.sku=s;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public double getPrice(){return price;} public void setPrice(double p){this.price=p;}
    public int getStock(){return stock;} public void setStock(int s){this.stock=s;}
    public Category getCategory(){return category;} public void setCategory(Category c){this.category=c;}
    public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant t){this.updatedAt=t;}
}
