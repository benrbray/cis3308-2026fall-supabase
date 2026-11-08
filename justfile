set dotenv-filename := ".env.local"
set dotenv-load := true

dev:
  npm run dev

generate-types:
  npx supabase gen types typescript --remote="$PROJECT_REF" --schema public > types/database.types.ts