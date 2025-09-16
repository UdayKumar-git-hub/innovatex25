export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
        "content-type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Cashfree error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
