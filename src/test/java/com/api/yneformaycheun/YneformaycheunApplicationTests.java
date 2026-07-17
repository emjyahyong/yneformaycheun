package com.api.yneformaycheun;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Vérifie le chargement du contexte et la création du schéma par Liquibase
 * sur une base PostgreSQL TestContainers.
 */
class YneformaycheunApplicationTests extends AbstractIntegrationTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void contextLoads() {
        assertNotNull(dataSource, "La DataSource doit être initialisée");
    }

    @Test
    void liquibaseExecutedSuccessfully() {
        List<String> tables = tablesPubliques();
        assertTrue(tables.contains("databasechangelog"), "databasechangelog doit exister");
        assertTrue(tables.contains("databasechangeloglock"), "databasechangeloglock doit exister");
    }

    @Test
    void allExpectedTablesExist() {
        List<String> tables = tablesPubliques();
        String[] attendues = {
                "users", "source", "article", "tag", "article_tag", "user_note",
                "databasechangelog", "databasechangeloglock"
        };
        for (String table : attendues) {
            assertTrue(tables.contains(table),
                    "La table '" + table + "' doit exister, trouvées : " + tables);
        }
    }

    private List<String> tablesPubliques() {
        return jdbcTemplate.queryForList(
                "SELECT tablename FROM pg_tables WHERE schemaname = 'public'", String.class);
    }
}
