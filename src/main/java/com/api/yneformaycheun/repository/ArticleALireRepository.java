package com.api.yneformaycheun.repository;

import com.api.yneformaycheun.model.ArticleALire;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleALireRepository extends JpaRepository<ArticleALire, Long> {

    Optional<ArticleALire> findByArticleIdAndUserEmail(Long articleId, String userEmail);

    Page<ArticleALire> findByUserEmailOrderByDateAjoutDesc(String userEmail, Pageable pageable);
}
