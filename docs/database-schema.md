# Database Schema

```mermaid
erDiagram
  users ||--o{ auth_accounts : links
  users ||--o{ reading_lists : owns
  reading_lists ||--o{ reading_list_items : contains
  books ||--o{ reading_list_items : appears_in
  books ||--o{ book_identifiers : has
  books ||--o{ book_subjects : tagged_with
  books ||--o{ book_metrics : measured_by

  users {
    text id PK
    text created_at
  }

  auth_accounts {
    text id PK
    text user_id FK
    text provider
    text provider_account_id
    text created_at
  }

  reading_lists {
    text id PK
    text user_id FK
    text name
    text slug
    boolean is_default
    text created_at
    text updated_at
  }

  books {
    text id PK
    text canonical_key
    text title
    text subtitle
    text author
    integer pages
    text language
    integer published_year
    text published_date
    text publisher
    text description
    text cover
    text primary_source
    text primary_source_book_id
    text isbn10
    text isbn13
    text series_name
    text series_position
    text created_at
    text updated_at
  }

  book_identifiers {
    text id PK
    text book_id FK
    text identifier
    text identifier_type
    text created_at
  }

  book_subjects {
    text id PK
    text book_id FK
    text subject
    text created_at
  }

  book_metrics {
    text id PK
    text book_id FK
    text source
    text metric_key
    float metric_value_number
    text metric_value_text
    text metric_value_json
    text created_at
    text updated_at
  }

  reading_list_items {
    text id PK
    text list_id FK
    text book_id FK
    integer position
    text created_at
    text updated_at
  }
```

Notes:
- `books` stores canonical metadata shared across users and lists.
- `book_subjects` models the many-to-many book taxonomy without cramming arrays into the book row.
- `book_metrics` is reserved for source-derived ratings, mood scores, and other external signals.
- `reading_list_items` keeps the ordered list state per user list, while `books` stays reusable.
