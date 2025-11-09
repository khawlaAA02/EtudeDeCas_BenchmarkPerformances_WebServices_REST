package variantC.api;

import variantC.repo.ItemRepository;
import variantC.model.Item;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/items")
public class ItemController {
    private final ItemRepository repo;

    public ItemController(ItemRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Item> list(@RequestParam(required = false) Long categoryId,
                           @RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "50") int size) {
        PageRequest pr = PageRequest.of(page, size);
        if (categoryId == null) {
            return repo.findAll(pr).getContent();
        } else {
            return repo.findByCategory_Id(categoryId, pr).getContent();
        }
    }

    @GetMapping("/{id}")
    public Item get(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Item create(@RequestBody Item i) {
        return repo.save(i);
    }

    @PutMapping("/{id}")
    public Item update(@PathVariable Long id, @RequestBody Item in) {
        Item i = repo.findById(id).orElseThrow();
        i.setSku(in.getSku());
        i.setName(in.getName());
        i.setPrice(in.getPrice());
        i.setStock(in.getStock());
        i.setCategory(in.getCategory());
        i.setUpdatedAt(Instant.now());
        return repo.save(i);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
