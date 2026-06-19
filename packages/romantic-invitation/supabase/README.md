# Supabase Migrations

Database schema migrations for the Invitation Builder.

## Setup

### 1. Initialize Supabase (if not already done)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Initialize local Supabase (optional, for local development)
supabase start
```

### 2. Run Migrations

**Option A: Via Supabase Dashboard (Easiest)**
1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Copy and paste the contents of each `.sql` file in order (001, 002, 003)
4. Execute each one

**Option B: Via Supabase CLI**
```bash
# Push migrations to remote
supabase db push

# Or run locally first
supabase migration new my_migration
# Then edit the file and run locally:
supabase db reset
```

## Schema Overview

### `invitations`
Stores invitation records with metadata and content.
- **Key fields**: `id`, `slug` (unique), `user_id`, `expires_at`, `is_published`
- **RLS**: Users see their own; public invitations visible to all
- **Constraints**: `expires_at > created_at`

### `invitation_responses`
Stores guest responses to invitations.
- **Key fields**: `id`, `invitation_id`, `accepted`, `submitted_at`
- **RLS**: Anyone can submit; only invitation owner can view
- **Constraints**: `submitted_at` reasonably close to `created_at`

### `invitation_views`
Tracks when invitations are viewed/opened.
- **Key fields**: `id`, `invitation_id`, `viewed_at`
- **RLS**: Anyone can record views; only invitation owner can view analytics
- **Optional**: `ip_address`, `user_agent` for analytics

## Column Mapping

The TypeScript types use camelCase, but the database uses snake_case:

| TypeScript | Database |
|------------|----------|
| `welcomeMessage` | `welcome_message` |
| `mainQuestion` | `main_question` |
| `senderName` | `sender_name` |
| `recipientName` | `recipient_name` |
| `dressColor` | `dress_color` |
| `loveLetter` | `love_letter` |
| `imageUrl` | `image_url` |
| `musicUrl` | `music_url` |

The backend code in `src/services/` automatically handles this mapping via Supabase's query builder.

## Development

To reset the database locally:
```bash
supabase db reset
```

This will run all migrations in order from scratch.

## Rollback

If you need to rollback a migration:
1. Create a new migration file with DROP statements
2. Number it appropriately (e.g., `004_rollback_something.sql`)
3. Push it to production

Example:
```sql
DROP TABLE IF EXISTS invitation_views CASCADE;
DROP TABLE IF EXISTS invitation_responses CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
```
