import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------------------------------------------------------------------------
// Resolve the signed-in installer and their assigned jobs.
// RLS scopes installations/jobs/customers to what this installer may see.
// ---------------------------------------------------------------------------
export const getInstallerJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: installer } = await supabase
      .from("installers")
      .select("installer_id, name")
      .eq("portal_user_id", userId)
      .maybeSingle();

    if (!installer) return { installer: null, jobs: [] as any[] };

    const { data: jobs } = await supabase
      .from("installations")
      .select(
        "installation_id, job_id, scheduled_date, arrival_time, status, " +
          "jobs(job_ref, package, status, customers(name, phone, address_line1, town, eircode))",
      )
      .eq("installer_id", installer.installer_id)
      .order("scheduled_date", { ascending: true });

    return { installer, jobs: jobs ?? [] };
  });

// ---------------------------------------------------------------------------
// One installation in full, with the job + customer for the on-site card.
// ---------------------------------------------------------------------------
const idSchema = z.object({ installationId: z.string().uuid() });

export const getInstallationDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => idSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: installation } = await supabase
      .from("installations")
      .select(
        "*, jobs(job_ref, package, status, customers(name, phone, address_line1, address_line2, town, county, eircode, access_notes))",
      )
      .eq("installation_id", data.installationId)
      .maybeSingle();
    return { installation: installation ?? null };
  });

// ---------------------------------------------------------------------------
// Save checklist progress. Partial — only sends changed fields. Also flips
// the installation to 'in_progress' the first time anything is recorded.
// ---------------------------------------------------------------------------
const saveSchema = z.object({
  installationId: z.string().uuid(),
  fields: z.object({
    checklist_mains: z.boolean().optional(),
    checklist_bypass: z.boolean().optional(),
    checklist_drain: z.boolean().optional(),
    checklist_powered: z.boolean().optional(),
    checklist_salt: z.boolean().optional(),
    checklist_regen: z.boolean().optional(),
    checklist_leaks: z.boolean().optional(),
    checklist_hardness_test: z.boolean().optional(),
    checklist_filter_tap: z.boolean().nullable().optional(),
    checklist_filter_line: z.boolean().nullable().optional(),
    hardness_before: z.number().nullable().optional(),
    hardness_after: z.number().nullable().optional(),
    serial_number: z.string().nullable().optional(),
    customer_signature_url: z.string().nullable().optional(),
    installation_notes: z.string().nullable().optional(),
  }),
});

export const saveChecklist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => saveSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const update: Record<string, unknown> = { ...data.fields };
    // Move to in_progress whenever the installer records something.
    update.status = "in_progress";
    const { error } = await supabase
      .from("installations")
      .update(update)
      .eq("installation_id", data.installationId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Complete — the only safe path. The DB function validates the full evidenced
// checklist, marks the install complete, moves the job to 'installed', and
// creates the warranty.
// ---------------------------------------------------------------------------
export const completeInstallation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => idSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.rpc("fn_complete_installation", {
      p_installation_id: data.installationId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
