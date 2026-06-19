# Database Schema

```mermaid
erDiagram
    USERS {
        text id PK
        timestamp created_at
    }

    BOOKS {
        uuid id PK
        text canonical_key UK
        text title
        text author
        text cover
        text primary_source
        text primary_source_book_id
        text isbn10
        text isbn13
        timestamp created_at
        timestamp updated_at
    }

    BOOK_METRICS {
        uuid id PK
        uuid book_id FK
        text source
        text metric_key
        real metric_value_number
        text metric_value_text
        json metric_value_json
        timestamp created_at
        timestamp updated_at
    }

    BOOK_GENRES {
        uuid book_id PK,FK
        text genre PK
        timestamp created_at
    }

    BOOK_MOODS {
        uuid book_id PK,FK
        text mood PK
        timestamp created_at
    }

    USER_BOOK_MOODS {
        text user_id PK,FK
        uuid book_id PK,FK
        text mood PK
        timestamp created_at
    }

    READING_LISTS {
        uuid id PK
        text user_id FK
        enum type
        text name
        timestamp created_at
        timestamp updated_at
    }

    READING_LIST_ITEMS {
        uuid id PK
        uuid list_id FK
        uuid book_id FK
        real position
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--o{ READING_LISTS : owns
    USERS ||--o{ USER_BOOK_MOODS : assigns

    BOOKS ||--o{ BOOK_METRICS : has
    BOOKS ||--o{ BOOK_GENRES : categorized_as
    BOOKS ||--o{ BOOK_MOODS : evokes
    BOOKS ||--o{ USER_BOOK_MOODS : receives
    BOOKS ||--o{ READING_LIST_ITEMS : appears_in

    READING_LISTS ||--o{ READING_LIST_ITEMS : contains
```

Notes:

- `books` stores canonical metadata shared across users and lists.
- `book_metrics` is reserved for source-derived ratings, mood scores, and other external signals.
- `reading_list_items` keeps the ordered list state per user list, while `books` stays reusable.
