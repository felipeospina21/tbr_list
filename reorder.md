🧱 Core idea

Each item has a position like:

A → 1
B → 2
C → 3

We compute a new value between neighbors:

between(1, 2) → 1.5

So reorder becomes:

C moves between A and B → 1.5

No shifting required.

🚀 1. Helper: compute middle position

```ts
export function between(a: number, b: number): number {
  return (a + b) / 2;
}
```

🚀 2. Move item between two others

This is the core function.

```ts
import { db } from "./db";
import { readingListItems } from "./schema";

export async function moveItem({
  itemId,
  beforeId,
  afterId,
}: {
  itemId: string;
  beforeId?: string | null;
  afterId?: string | null;
}) {
  return db.transaction(async (tx) => {
    // Get current item
    const [item] = await tx
      .select()
      .from(readingListItems)
      .where(eq(readingListItems.id, itemId));

    if (!item) throw new Error("Item not found");

    let newPosition: number;

    // CASE 1: move to top
    if (!beforeId) {
      const [after] = await tx
        .select()
        .from(readingListItems)
        .where(eq(readingListItems.id, afterId!));

      newPosition = after.position - 1;
    }

    // CASE 2: move to bottom
    else if (!afterId) {
      const [before] = await tx
        .select()
        .from(readingListItems)
        .where(eq(readingListItems.id, beforeId));

      newPosition = before.position + 1;
    }

    // CASE 3: between two items (main case)
    else {
      const [before] = await tx
        .select()
        .from(readingListItems)
        .where(eq(readingListItems.id, beforeId));

      const [after] = await tx
        .select()
        .from(readingListItems)
        .where(eq(readingListItems.id, afterId));

      newPosition = between(before.position, after.position);
    }

    // Update item
    await tx
      .update(readingListItems)
      .set({ position: newPosition })
      .where(eq(readingListItems.id, itemId));
  });
}
```

🚀 3. Insert new item at end

```ts
export async function insertItemAtEnd(listId: string, bookId: string) {
  const lastItem = await db
    .select()
    .from(readingListItems)
    .where(eq(readingListItems.listId, listId))
    .orderBy(desc(readingListItems.position))
    .limit(1);

  const position = lastItem.length > 0 ? lastItem[0].position + 1 : 1;

  return db.insert(readingListItems).values({
    listId,
    bookId,
    position,
  });
}
```

🚀 4. Insert between items

```ts
export async function insertBetween({
  listId,
  bookId,
  beforeId,
  afterId,
}: {
  listId: string;
  bookId: string;
  beforeId?: string;
  afterId?: string;
}) {
  let position: number;

  if (!beforeId) {
    const after = await db
      .select()
      .from(readingListItems)
      .where(eq(readingListItems.id, afterId!))
      .limit(1);

    position = after[0].position - 1;
  } else if (!afterId) {
    const before = await db
      .select()
      .from(readingListItems)
      .where(eq(readingListItems.id, beforeId))
      .limit(1);

    position = before[0].position + 1;
  } else {
    const before = await db
      .select()
      .from(readingListItems)
      .where(eq(readingListItems.id, beforeId))
      .limit(1);

    const after = await db
      .select()
      .from(readingListItems)
      .where(eq(readingListItems.id, afterId))
      .limit(1);

    position = between(before[0].position, after[0].position);
  }

  return db.insert(readingListItems).values({
    listId,
    bookId,
    position,
  });
}
```

⚠️ 5. Important edge case (you WILL hit this later)

If users reorder a lot, numbers can get tight:

```
1.00000001
1.00000002
```

```ts
Fix: normalization function
export async function normalizePositions(listId: string) {
const items = await db
.select()
.from(readingListItems)
.where(eq(readingListItems.listId, listId))
.orderBy(readingListItems.position);

let pos = 1;

for (const item of items) {
await db
.update(readingListItems)
.set({ position: pos++ })
.where(eq(readingListItems.id, item.id));
}
}
```

Call this occasionally (or when spacing gets too tight).

🧠 Why this works well

You now get:

✔ no bulk updates on reorder
✔ no constraint violations
✔ safe concurrent inserts (mostly)
✔ simple queries (ORDER BY position)
✔ minimal DB load
⚠️ One important constraint change

You currently have:

unique(listId, position)

You can keep it, BUT:

👉 with floats, uniqueness is theoretical risk due to precision

Better:

Either:

keep it (fine for your scale)
or remove it and rely on app logic
🚀 Final recommendation

Use:

real() position
fractional indexing
occasional normalization
transaction-safe updates (as above)
