import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// €18.00 placeholder until real salt pricing is confirmed (cents).
const PRICE_PER_BAG = 1800;

// ---------------------------------------------------------------------------
// Helper: resolve the signed-in customer's most recent job.
// Jobs are READ through the customer_jobs view (the base jobs table is not
// readable by customers — it hides cost/profit columns). RLS scopes rows to
// the signed-in user automatically.
// ---------------------------------------------------------------------------
async function latestJob(supabase: any) {
  const { data: jobs } = await supabase
    .from("customer_jobs")
    .select(
      "job_id, job_ref, status, package, sale_price, deposit_amount, balance_amount, deposit_paid_at, balance_paid_at, created_at",
    )
    .order("created_at", { ascending: false });
  return jobs?.[0] ?? null;
}

// ---------------------------------------------------------------------------
// Dashboard — everything the landing page of the portal needs.
// ---------------------------------------------------------------------------
export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: customer } = await supabase
      .from("customers")
      .select(
        "customer_id, name, phone, email, address_line1, address_line2, town, county, eircode",
      )
      .eq("portal_user_id", userId)
      .maybeSingle();

    const empty = {
      customer: customer ?? null,
      job: null,
      installation: null,
      warranty: null,
      recentClaims: [] as any[],
      recentSalt: [] as any[],
    };

    if (!customer) return empty;

    const job = await latestJob(supabase);
    if (!job) return { ...empty, customer };

    const [{ data: installation }, { data: warranty }, { data: recentClaims }, { data: recentSalt }] =
      await Promise.all([
        supabase
          .from("installations")
          .select(
            "scheduled_date, arrival_time, completion_time, status, hardness_before, hardness_after, serial_number",
          )
          .eq("job_id", job.job_id)
          .maybeSingle(),
        supabase
          .from("warranties")
          .select(
            "warranty_id, mfr_warranty_type, mfr_warranty_years, mfr_expiry, work_warranty_years, work_expiry, status, claim_count",
          )
          .eq("job_id", job.job_id)
          .maybeSingle(),
        supabase
          .from("warranty_claims")
          .select("claim_id, description, status, priority, created_at")
          .eq("job_id", job.job_id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("salt_orders")
          .select("order_id, bags_quantity, total_price, status, delivery_date, created_at")
          .eq("job_id", job.job_id)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

    return {
      customer,
      job,
      installation: installation ?? null,
      warranty: warranty ?? null,
      recentClaims: recentClaims ?? [],
      recentSalt: recentSalt ?? [],
    };
  });

// ---------------------------------------------------------------------------
// Warranty page — full warranty + all claims.
// ---------------------------------------------------------------------------
export const getWarranty = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const job = await latestJob(supabase);
    if (!job)
      return { warranty: null, claims: [] as any[], package: null, customerName: null, installation: null };

    const [{ data: warranty }, { data: claims }, { data: customer }, { data: installation }] =
      await Promise.all([
        supabase.from("warranties").select("*").eq("job_id", job.job_id).maybeSingle(),
        supabase
          .from("warranty_claims")
          .select("claim_id, description, status, priority, created_at, resolved_at")
          .eq("job_id", job.job_id)
          .order("created_at", { ascending: false }),
        supabase.from("customers").select("name").eq("portal_user_id", userId).maybeSingle(),
        supabase
          .from("installations")
          .select("serial_number, completion_time, scheduled_date")
          .eq("job_id", job.job_id)
          .maybeSingle(),
      ]);

    return {
      warranty: warranty ?? null,
      claims: claims ?? [],
      package: (job.package as string) ?? null,
      customerName: customer?.name ?? null,
      installation: installation ?? null,
    };
  });

const claimSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Please describe the issue (at least 10 characters).")
    .max(2000),
});

export const raiseWarrantyClaim = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => claimSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const job = await latestJob(supabase);
    if (!job) throw new Error("No job found for your account.");

    const { data: warranty } = await supabase
      .from("warranties")
      .select("warranty_id")
      .eq("job_id", job.job_id)
      .maybeSingle();
    if (!warranty) throw new Error("No warranty is registered for your installation yet.");

    const { error } = await supabase.from("warranty_claims").insert({
      job_id: job.job_id,
      warranty_id: warranty.warranty_id,
      description: data.description,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Salt page — gated to Complete & Premium (DB enforces this too via RLS).
// ---------------------------------------------------------------------------
export const getSaltOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const job = await latestJob(supabase);
    const eligible = job?.package === "complete" || job?.package === "premium";
    if (!job || !eligible) return { eligible: false, orders: [] as any[] };

    const { data: orders } = await supabase
      .from("salt_orders")
      .select(
        "order_id, bags_quantity, total_price, status, delivery_date, delivery_notes, created_at",
      )
      .eq("job_id", job.job_id)
      .order("created_at", { ascending: false });

    return { eligible: true, orders: orders ?? [] };
  });

const saltSchema = z.object({
  bags: z.number().int().min(1).max(10),
  notes: z.string().trim().max(500).optional().default(""),
});

export const createSaltOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => saltSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: customer } = await supabase
      .from("customers")
      .select("customer_id")
      .eq("portal_user_id", userId)
      .maybeSingle();
    const job = await latestJob(supabase);

    if (!customer || !job) throw new Error("No job found for your account.");
    if (job.package !== "complete" && job.package !== "premium") {
      throw new Error("Salt delivery is available on the Complete and Premium packages.");
    }

    const total = data.bags * PRICE_PER_BAG;
    const { error } = await supabase.from("salt_orders").insert({
      job_id: job.job_id,
      customer_id: customer.customer_id,
      bags_quantity: data.bags,
      price_per_bag: PRICE_PER_BAG,
      total_price: total,
      status: "requested",
      delivery_notes: data.notes || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Documents page — install evidence (before/after photos + result data).
// NOTE: photo URLs may be private storage paths once the storage lockdown is
// applied; at that point wrap them in createSignedUrl() here.
// ---------------------------------------------------------------------------
export const getJobMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const job = await latestJob(supabase);
    if (!job) return { job: null, photos: [] as any[], installation: null };

    const [{ data: photos }, { data: installation }] = await Promise.all([
      supabase
        .from("photos")
        .select("photo_id, type, url, caption, uploaded_at")
        .eq("job_id", job.job_id)
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("installations")
        .select("hardness_before, hardness_after, serial_number, completion_time")
        .eq("job_id", job.job_id)
        .maybeSingle(),
    ]);

    return { job, photos: photos ?? [], installation: installation ?? null };
  });
