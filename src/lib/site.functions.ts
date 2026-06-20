import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Public — no auth. A website visitor can't write to customers/jobs under RLS,
// so this runs server-side with the service role to create the lead securely.
const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(3, "Phone is required").max(40),
  location: z.string().trim().max(160).optional().default(""),
  pkg: z.string().trim().max(40).optional().default(""),
  timing: z.string().trim().max(80).optional().default(""),
});

const PKG_MAP: Record<string, "essential" | "complete" | "premium"> = {
  Essential: "essential",
  Complete: "complete",
  Premium: "premium",
};

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((i) => schema.parse(i))
  .handler(async ({ data }) => {
    const pkg = PKG_MAP[data.pkg] ?? null;

    const { data: customer, error: cErr } = await supabaseAdmin
      .from("customers")
      .insert({
        name: data.name,
        phone: data.phone,
        town: data.location || null,
      })
      .select("customer_id")
      .single();
    if (cErr) throw new Error(cErr.message);

    const notes =
      `Website enquiry. Package interest: ${data.pkg || "Not sure"}. ` +
      `Timing: ${data.timing || "—"}. Area: ${data.location || "—"}.`;

    const { error: jErr } = await supabaseAdmin.from("jobs").insert({
      customer_id: customer.customer_id,
      status: "lead",
      lead_source: "website",
      package: pkg,
      notes,
    });
    if (jErr) throw new Error(jErr.message);

    return { ok: true };
  });
