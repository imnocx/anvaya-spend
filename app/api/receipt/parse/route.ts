import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const receiptSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "string", enum: ["income", "expense"] },
    amount: { type: "number", minimum: 0 },
    category: { type: "string" },
    description: { type: "string" },
    transaction_date: { type: "string" },
  },
  required: ["type", "amount", "category", "description", "transaction_date"],
};

function isReceiptResult(value: unknown): value is {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
} {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  return (
    (result.type === "income" || result.type === "expense") &&
    typeof result.amount === "number" &&
    Number.isFinite(result.amount) &&
    result.amount > 0 &&
    typeof result.category === "string" &&
    typeof result.description === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(String(result.transaction_date))
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Pemindaian struk belum dikonfigurasi. Tambahkan OPENAI_API_KEY pada server." },
      { status: 503 }
    );
  }

  try {
    const { image } = (await request.json()) as { image?: unknown };
    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Foto struk tidak valid." }, { status: 400 });
    }

    const base64 = image.split(",")[1] || "";
    if ((base64.length * 3) / 4 > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Ukuran foto maksimal 8 MB." }, { status: 413 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_RECEIPT_MODEL || "gpt-4.1-mini",
        store: false,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Baca foto bukti transaksi Indonesia ini. Ekstrak hanya transaksi utama yang benar-benar terlihat. Nominal harus berupa angka Rupiah tanpa pemisah. Tentukan type: expense untuk pembayaran/pembelian, income untuk dana yang diterima. Pilih category hanya dari: expense = Makanan, Transportasi, Belanja, Pendidikan, Hiburan, Tagihan, Kesehatan, Lainnya; income = Gaji, Uang Saku, Investasi, Bonus, Penjualan, Lainnya. Gunakan nama merchant/ringkasan singkat sebagai description. Tanggal harus YYYY-MM-DD; jika tanggal tidak terlihat gunakan ${today}. Jangan menebak nominal.`,
              },
              { type: "input_image", image_url: image, detail: "high" },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "receipt_transaction",
            strict: true,
            schema: receiptSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error("Receipt extraction failed:", response.status, await response.text());
      return NextResponse.json({ error: "Foto belum bisa dipindai. Coba lagi." }, { status: 502 });
    }

    const payload = (await response.json()) as { output_text?: string };
    const result: unknown = JSON.parse(payload.output_text || "{}");
    if (!isReceiptResult(result)) {
      return NextResponse.json({ error: "Data pada struk tidak terbaca dengan yakin." }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Receipt parsing error:", error);
    return NextResponse.json({ error: "Gagal memproses foto struk." }, { status: 500 });
  }
}
