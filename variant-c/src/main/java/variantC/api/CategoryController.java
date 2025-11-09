package variantC.api;

import variantC.repo.CategoryRepository;
import variantC.model.Category;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Category> list(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "50") int size) {
        PageRequest pr = PageRequest.of(page, size);
        return repo.findAll(pr).getContent();
    }

    @GetMapping("/_count")
    public long count() {
        return repo.count();
    }

    @GetMapping("/{id}")
    public Category get(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Category create(@RequestBody Category c) {
        return repo.save(c);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category in) {
        Category c = repo.findById(id).orElseThrow();
        c.setCode(in.getCode());
        c.setName(in.getName());
        c.setUpdatedAt(Instant.now());
        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
