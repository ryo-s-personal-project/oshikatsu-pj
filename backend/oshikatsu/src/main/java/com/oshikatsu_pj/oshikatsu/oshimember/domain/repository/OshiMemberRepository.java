package com.oshikatsu_pj.oshikatsu.oshimember.domain.repository;

import com.oshikatsu_pj.oshikatsu.oshimember.domain.model.OshiMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OshiMemberRepository extends JpaRepository<OshiMember, Long> {
    Optional<List<OshiMember>> findByGroupId(Long groupId, Long userId);
    Optional<OshiMember> findByMemberName(String memberName, Long userId);
    boolean existsByMemberName(String memberName, Long userId);
}
