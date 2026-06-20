# ClearWater Ireland — Deploy to Vercel

One app: marketing site (`/`), customer portal (`/portal`), installer portal (`/installer`).
Owner dashboard (`/admin`) is added at month-end. Stack: TanStack Start + Nitro (Vercel target),
Supabase backend.

## 1. Prerequisites (on Supabase — the NEW project)
1. Run `CWI_Supabase_CLEAN_INSTALL.sql` in the SQL editor (one pass).
2. Create your owner login (Authentication → Add user, auto-confirm) and promote:
   `UPDATE user_profiles SET role = 'owner' WHERE email = 'you@example.com';`
3. Create two **private** storage buckets: `job-photos` and `signatures`.
   (Installer photo + signature upload — and therefore completing a job — need these.)
4. Create installer/customer logins the same way, and link them:
   - installer: `UPDATE installers SET portal_user_id = '<auth-user-id>' WHERE ...`
   - customer: `UPDATE customers SET portal_user_id = '<auth-user-id>' WHERE ...`

## 2. Environment variables (set in Vercel → Project → Settings → Environment Variables)
From the NEW Supabase project's API settings:

```
VITE_SUPABASE_URL              = https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY  = <anon/publishable key>
SUPABASE_URL                   = https://<project>.supabase.co
SUPABASE_PUBLISHABLE_KEY       = <anon/publishable key>
SUPABASE_SERVICE_ROLE_KEY      = <service role key>     # server-only; powers the enquiry form
```

(The website chatbot is a built-in FAQ assistant — no AI key required.)

For local dev, put the same in `.env` (already scaffolded with placeholders).

## 3. Deploy
1. `npm install`
2. Push the repo to GitHub.
3. Vercel → Add New → Project → import the repo. Framework is auto-detected (TanStack Start/Nitro).
4. Add the environment variables above. Deploy.
5. Point `clearwaterireland.ie` at the Vercel project.

## 4. Notes
- The first `npm run dev` or build regenerates `src/routeTree.gen.ts` to register the installer routes.
- Storage buckets are private — the app reads files via signed URLs. Send the bucket list to get exact storage policies.
- Chatbot: a built-in **FAQ assistant** that runs entirely in the browser — no API key, no cost, no rate limits. To add or edit answers, edit the `KB` list in `src/components/site/Chatbot.tsx`. (An optional AI endpoint remains at `src/routes/api/chat.ts` if you ever want to switch to a live model.)
- `/admin` owner dashboard is the month-end addition; until then manage data in the Supabase table editor.
