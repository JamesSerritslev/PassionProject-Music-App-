/// <reference types="deno" />
/// <reference path="./deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_EMAIL = "feedback@bandscope.net";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email ?? "unknown";
    const role = body.role ?? "unknown";
    const userId = body.user_id ?? "unknown";

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return Response.json(
        { error: "Email service not configured" },
        { status: 500, headers: corsHeaders }
      );
    }

    const now = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BandScope <noreply@bandscope.net>",
        to: [NOTIFY_EMAIL],
        subject: `New BandScope signup: ${email}`,
        html: `
          <h2>New Account Created</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:4px 12px;font-weight:bold;">Email</td><td style="padding:4px 12px;">${email}</td></tr>
            <tr><td style="padding:4px 12px;font-weight:bold;">Role</td><td style="padding:4px 12px;">${role}</td></tr>
            <tr><td style="padding:4px 12px;font-weight:bold;">User ID</td><td style="padding:4px 12px;">${userId}</td></tr>
            <tr><td style="padding:4px 12px;font-weight:bold;">Signed up</td><td style="padding:4px 12px;">${now}</td></tr>
          </table>
        `,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Resend error:", res.status, errBody);
      return Response.json(
        { error: "Failed to send email", detail: errBody },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json(
      { success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500, headers: corsHeaders }
    );
  }
});
