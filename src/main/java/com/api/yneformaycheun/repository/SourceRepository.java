package com.api.yneformaycheun.repository;

import com.api.yneformaycheun.model.Source;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SourceRepository extends JpaRepository<Source, Long> {

    /** Sources appartenant à l'utilisateur identifié par son e-mail (source.user.email). */
    List<Source> findByUserEmail(String userEmail);
}
