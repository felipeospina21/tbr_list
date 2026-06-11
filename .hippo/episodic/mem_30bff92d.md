---
id: mem_30bff92d
created: "2026-06-06T02:08:39.493Z"
last_retrieved: "2026-06-11T01:13:22.214Z"
retrieval_count: 51
strength: 1
half_life_days: 289
layer: episodic
tags: []
emotional_valence: neutral
schema_fit: 0.5
source: cli
outcome_score: 1
conflicts_with: []
pinned: false
confidence: verified
---

Feature organization convention: use queries/ for query hooks, mutations/ for mutation hooks, and hooks/ only for other hooks. Keep each operation self-contained: the fetch function, operation-specific types, query key, and directly related variables should live in the hook file that implements that query or mutation. Prefer colocating code with the closest semantic owner instead of extracting shared files prematurely; for example the reading-list query key is used by mutations but semantically belongs to the reading-list query.
