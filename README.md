# Guide:  Create Supabase Project

1. Log in using your GitHub account
2. Join my organization???
2. Create a new Project
  - GitHub repository (TODO?)
  - Generate new database password
  - [x] Enable Data API
  - [ ] Automatically expose new tables
  - [x] Enable automatic RLS


# Guide: [Using Supabase with React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

1. `npm create vite@latest my-app -- --template react`
2. `npm install @supabase/supabase-js`
3. In the project root, create an `.env.local` file with a `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the **Connect** page of your project settings. (click the green **Connect** button at the top of the page.)

Make sure the `.env.local` file is in your `.gitignore`.

4. Create the Supabase client

```ts
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
```