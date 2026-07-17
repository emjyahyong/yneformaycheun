package com.api.yneformaycheun.repository;

import com.api.yneformaycheun.model.Tag;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByUserEmail(String userEmail);
}
