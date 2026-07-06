import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, reason, category, fileKey } = body;

    if (!name || !email || !phone || !reason || !category || !fileKey) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const actionToken = randomUUID();

    const { data, error } = await supabaseAdmin
      .from("cv_requests")
      .insert({
        name,
        email,
        phone,
        reason,
        category,
        file_key: fileKey,
        status: "pending",
        action_token: actionToken,
      })
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Could not save request." },
        { status: 500 }
      );
    }

    const siteUrl = process.env.SITE_URL;
    const approveUrl = `${siteUrl}/api/cv-approve?id=${data.id}&token=${actionToken}&action=approve`;
    const rejectUrl = `${siteUrl}/api/cv-approve?id=${data.id}&token=${actionToken}&action=reject`;

    await resend.emails.send({
      from: "CV Requests <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New CV Request: ${category}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2>New CV Download Request</h2>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <div style="margin-top: 24px;">
            <a href="${approveUrl}" style="background:#8b5cf6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-right:10px;">Approve</a>
            <a href="${rejectUrl}" style="background:#444;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Reject</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}