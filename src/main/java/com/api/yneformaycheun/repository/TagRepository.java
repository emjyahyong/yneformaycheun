package com.api.yneformaycheun.repository;

import com.api.yneformaycheun.model.Tag;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByUserEmail(String userEmail);

    /** Tag borné à son propriétaire, utilisé pour les contrôles d'accès. */
    Optional<Tag> findByIdAndUserEmail(Long id, String userEmail);
}
