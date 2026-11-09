# Example:  Book Reviews with `Supabase`

## Resources

I created this example project by following these guides:

- [Using Supabase with React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Generate Types](https://supabase.com/docs/guides/api/rest/generating-types)

Your final project setup may be a little different (depending on what you want to achieve), so check the Supabase documentation to see what is possible!

## Create Supabase Account

Create a Supabase account.  Using the **Sign In with GitHub** option will be convenient.

## Create Supabase Project

Use the [Supabase Dashboard](https://supabase.com/dashboard) to create a new project.

- Choose a *Database Password*.  (Do **NOT** save your password in `git`!)
- Use the settings below:
  - [x] Enable Data API
  - [ ] Automatically expose new tables
  - [x] Enable automatic RLS

## Create `vite` Project

In your terminal, `cd` to a folder where you want your project to live.  Make sure it's not already a `git` repository (`git status` should cause a `fatal error`).  Then, use `npm create vite` and follow the instructions.

## Install Supabase Client Package

```
npm install @supabase/supabase-js
```

## Create `.env.local` File

First, create or modify the `.gitignore` file to contain the following lines:

```
.env
.env.local
```

Many tools (including `just`) support reading project secrets from file names starting with `.env`.  Now, create a new file named `.env.local` with the following contents:

```bash
VITE_SUPABASE_URL="your_url_here"
VITE_SUPABASE_PUBLISHABLE_KEY="your_key_here"
```

Replace the placeholder strings with values found in your **Supabase Connect Dashboard**.

## Create `books` Table

I ran the following query in the **Supabase SQL Editor** to create a new table named `books`.  The most important part is `CREATE TABLE`, and the rest describes permissions for different users and operations.  This table is **publicly readable and writable** by anyone.

```sql
CREATE TABLE books (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INT NOT NULL,
  genre TEXT NOT NULL,
  summary TEXT NOT NULL
);

-- Grant the privileges the role needs, which is read access
GRANT SELECT ON public.books TO anon, authenticated;
GRANT INSERT ON public.books TO anon, authenticated;
GRANT DELETE ON public.books TO anon, authenticated;

-- Enable row level security for the table
ALTER TABLE books
  ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow the anon role to read from the instruments table
CREATE POLICY "public can read books table"
  ON public.books
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "anyone can insert books table"
  ON public.books
  FOR INSERT
  TO anon, authenticated
  WITH CHECK ( true );

CREATE POLICY "Anyone can delete books table"
  ON public.books
  FOR DELETE
  TO anon, authenticated
  USING (true);
```

## Populate `books` Table with Example Data

```sql
INSERT INTO books (title, author, year, genre, summary)
VALUES
  ('Pride and Prejudice', 'Jane Austen', 1813, 'fiction',
    'When wealthy Mr. Darcy arrives in their countryside neighborhood, his pride and Elizabeth''s prejudice set the stage for misunderstandings, hidden truths, and unexpected revelations about character and love.'
  ),
  ('Dracula', 'Bram Stoker', 1897, 'horror',
    'Told through letters, diary entries, and newspaper articles, the story follows solicitor Jonathan Harker''s terrifying encounter with Count Dracula in Transylvania.'
  ),
  ('The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 1892, 'mystery',
    'These twelve tales feature the legendary consulting detective Sherlock Holmes and his companion Dr. Watson, narrated from Watson''s perspective.'
  ),
  ('War and Peace', 'Leo Tolstoy', 1869, 'fiction',
    'Set during the Napoleonic Wars, it chronicles the French invasion of Russia through five interlocking narratives following different Russian aristocratic families.'
  )
```

## Retrieve Books

Get all books:

```sql
SELECT * FROM books;
```

Get specific columns only:

```sql
SELECT title, author
FROM books
```

Filter by genre:

```sql
SELECT title, author
FROM books
WHERE genre = 'fiction'
```


## Create the Supabase client

```ts
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
```

# Guide: [Generate Types](https://supabase.com/docs/guides/api/rest/generating-types)

Log in to supabase using your browser.

```bash
npx supabase login
```

Initialize supabase locally.

```bash
npx supabase init
```

Generate types for database entities:

```bash
npx supabase gen types typescript --remote="$PROJECT_REF" --schema public > database.types.ts
```