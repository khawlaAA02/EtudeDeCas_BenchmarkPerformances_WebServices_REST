package variantD.model;

import jakarta.persistence.*;

@Entity
public class Item {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String name;
    public String description;
    public Double price;
    public Integer stock;

    @ManyToOne
    public Category category;
}
