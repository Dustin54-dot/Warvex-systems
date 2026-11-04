
export async function onRequestGet({ env }) {
  return Response.json({
    ok: true,
    aiBinding: Boolean(env.AI),
    service: "WARVEX Cloud AI"
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.AI) {
    return Response.json(
      { error: "Workers AI ist nicht verbunden. Prüfe die Bindung AI." },
      { status: 503 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.messages)) {
    return Response.json(
      { error: "Keine Nachrichten erhalten." },
      { status: 400 }
    );
  }

  const messages = body.messages
    .filter(m =>
      m &&
      ["user", "assistant", "system"].includes(m.role) &&
      typeof m.content === "string"
    )
    .slice(-18)
    .map(m => ({
      role: m.role,
      content: m.content.slice(0, 5000)
    }));

  try {
    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages,
        max_tokens: 900,
        temperature: 0.7
      }
    );

    const answer =
      result?.response ??
      result?.result?.response;

    if (!answer) {
      throw new Error("Keine Antwort vom KI-Modell.");
    }

    return Response.json({ answer });

  } catch (error) {
    return Response.json(
      { error: error.message || "KI-Fehler" },
      { status: 502 }
    );
  }
}
