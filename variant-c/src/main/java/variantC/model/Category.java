package variantC.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity @Table(name="category")
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length=32)
    private String code;

    @Column(nullable=false, length=128)
    private String name;

    @Column(name="updated_at", nullable=false)
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy="category")
    @JsonManagedReference           // <-- côté “parent” de la relation
    private List<Item> items = new ArrayList<>();

    public Long getId(){return id;}
    public String getCode(){return code;} public void setCode(String c){this.code=c;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant t){this.updatedAt=t;}
    public List<Item> getItems(){return items;} public void setItems(List<Item> it){this.items=it;}
}
