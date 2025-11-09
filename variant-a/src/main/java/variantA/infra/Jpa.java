package variantA.infra;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.util.HashMap;
import java.util.Map;

public class Jpa {
    private static final EntityManagerFactory emf = build();

    private static EntityManagerFactory build() {
        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(System.getenv().getOrDefault("DB_URL", "jdbc:postgresql://localhost:5432/perfdb"));
        cfg.setUsername(System.getenv().getOrDefault("DB_USER", "perf"));
        cfg.setPassword(System.getenv().getOrDefault("DB_PASSWORD", "perf"));
        cfg.setMaximumPoolSize(Integer.parseInt(System.getenv().getOrDefault("HIKARI_MAX","20")));
        HikariDataSource ds = new HikariDataSource(cfg);

        Map<String, Object> props = new HashMap<>();
        props.put("jakarta.persistence.nonJtaDataSource", ds);
        props.put("hibernate.hbm2ddl.auto", "none");
        props.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        props.put("hibernate.show_sql", "false");
        return Persistence.createEntityManagerFactory("benchPU", props);
    }

    public static EntityManager em() { return emf.createEntityManager(); }
}
