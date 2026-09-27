// SnapCal GS1-China relay: ONE lookup per genuine scan-miss, result cached by
// the app into barcodes_learned so no code is ever queried twice.
// Deploy:  supabase functions deploy gtin --no-verify-jwt=false
// NOTE: LOOKUP_URL is finalized from the exact request shape captured in the
// account holder's own browser session (DevTools → Request URL).
const LOOKUP_URL = Deno.env.get("GDS_LOOKUP_URL") ??
  "https://bff.gds.org.cn/gds/searching-api/ProductService/ProductSimpleInfoByGTIN?gtin=";

Deno.serve(async (req) => {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  if (!/^[0-9]{8,14}$/.test(code)) {
    return Response.json({ error: "bad code" }, { status: 400 });
  }
  const gtin = code.padStart(14, "0");
  try {
    const r = await fetch(LOOKUP_URL + gtin, {
      headers: { "User-Agent": "SnapCal/1.0 (single-lookup per user scan)" },
    });
    const j = await r.json();
    const d = j?.Data ?? j?.data ?? null;
    if (!d) return Response.json({ name: null });
    return Response.json({
      name: d.ProductName ?? d.productName ?? d.Name ?? null,
      brand: d.BrandName ?? d.brandName ?? null,
      company: d.FirmName ?? d.EnterpriseName ?? null,
    });
  } catch {
    return Response.json({ name: null }, { status: 502 });
  }
});
