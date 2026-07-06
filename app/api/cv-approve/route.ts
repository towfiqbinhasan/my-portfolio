import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  if (!id || !token || !action) {
    return new NextResponse("Invalid request.", { status: 400 });
  }

  const { data: request, error } = await supabaseAdmin
    .from("cv_requests")
    .select("*")
    .eq("id", id)
    .eq("action_token", token)
    .single();

  if (error || !request) {
    return new NextResponse("Request not found or invalid link.", {
      status: 404,
    });
  }

  if (request.status !== "pending") {
    return new NextResponse(
      `This request has already been ${request.status}.`,
      { status: 200 }
    );
  }

  if (action === "approve") {
    const { data: signedUrlData, error: signError } =
      await supabaseAdmin.storage
        .from("cvs")
        .createSignedUrl(request.file_key, 60 * 60 * 24);

    if (signError || !signedUrlData) {
      return new NextResponse("Could not generate download link.", {
        status: 500,
      });
    }

    await supabaseAdmin
      .from("cv_requests")
      .update({ status: "approved" })
      .eq("id", id);

    await resend.emails.send({
      from: "Towfiq Bin Hasan <onboarding@resend.dev>",
      to: request.email,
      subject: "Your CV request has been approved",
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2>Hi ${request.name},</h2>
          <p>Your request for the <strong>${request.category}</strong> CV has been approved.</p>
          <p>You can download it using the button below (link valid for 24 hours):</p>
          <a href="${signedUrlData.signedUrl}" style="background:#8b5cf6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px;">Download CV</a>
          <p style="margin-top:24px;color:#888;">Thank you for your interest!</p>
        </div>
      `,
    });

    return new NextResponse(
      "Request approved. The applicant has been emailed a download link.",
      { status: 200 }
    );
  }

  if (action === "reject") {
    await supabaseAdmin
      .from("cv_requests")
      .update({ status: "rejected" })
      .eq("id", id);

    return new NextResponse("Request rejected.", { status: 200 });
  }

  return new NextResponse("Unknown action.", { status: 400 });
}