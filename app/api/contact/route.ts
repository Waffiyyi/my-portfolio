import { NextResponse } from "next/server";
import { validateContact, type ContactFields } from "@/lib/contact";
import { getMission } from "@/data/site";
export const runtime = "nodejs";
// This access key was already public in the original Web3Forms integration.
// It is a form identifier, not an API secret. Override it with a server env var if rotating.
const existingFormKey = "d297a02d-5749-4ebf-b049-24de7cdada20";
const attempts = new Map<string, { count: number; reset: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { success: false, message: "This request must come from the portfolio." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { success: false, message: "Expected a JSON message." },
      { status: 415 },
    );
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 16000)
    return NextResponse.json(
      { success: false, message: "Your message is too large." },
      { status: 413 },
    );
  let data: Partial<ContactFields>;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json(
        { success: false, message: "Your message is too large." },
        { status: 413 },
      );
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    data = Object.fromEntries(
      Object.entries(parsed).filter(([, v]) => typeof v === "string"),
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Please check your message and try again." },
      { status: 400 },
    );
  }
  if (data.website)
    return NextResponse.json(
      { success: false, message: "Unable to accept this submission." },
      { status: 400 },
    );
  const errors = validateContact(data);
  if (Object.keys(errors).length)
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields.",
        errors,
      },
      { status: 400 },
    );
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.reset <= now) attempts.delete(key);
  // Best-effort instance limit; Web3Forms also applies provider-side spam/rate safeguards.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = attempts.get(ip) || { count: 0, reset: now + 600000 };
  if (limit.count >= 5)
    return NextResponse.json(
      {
        success: false,
        message:
          "Too many attempts. Please wait a few minutes or contact me by email.",
      },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  limit.count++;
  if (attempts.size < 10000 || attempts.has(ip)) attempts.set(ip, limit);
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY || existingFormKey,
        name: data.name?.trim(),
        email: data.email?.trim(),
        message: data.message?.trim(),
        subject: `Portfolio enquiry${getMission(data.mission) ? " — " + getMission(data.mission)?.title : ""}`,
        from_name: "Waffiyyi Fashola Portfolio",
        botcheck: false,
      }),
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json();
    if (!response.ok || result.success !== true)
      throw new Error("Provider rejected request");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "The message service is unavailable. Your message is preserved; please try again or open an email draft.",
      },
      { status: 502 },
    );
  }
}
