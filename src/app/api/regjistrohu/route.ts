import { APIError } from "better-auth/api";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { registrationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Të dhënat nuk janë të vlefshme." },
      { status: 400 },
    );
  }

  try {
    const { name, email, password } = parsed.data;
    await auth.api.signUpEmail({
      body: { name, email, password },
      headers: request.headers,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof APIError) {
      const duplicate = error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";
      return NextResponse.json(
        { error: duplicate ? "Ky email është regjistruar më parë." : "Regjistrimi dështoi. Provo përsëri." },
        { status: duplicate ? 409 : error.statusCode },
      );
    }

    return NextResponse.json({ error: "Regjistrimi dështoi. Provo përsëri." }, { status: 500 });
  }
}
