package com.api.yneformaycheun.repository;

import com.api.yneformaycheun.model.UserNote;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserNoteRepository extends JpaRepository<UserNote, Long> {

    List<UserNote> findByArticleIdAndUserEmail(Long articleId, String userEmail);
}
