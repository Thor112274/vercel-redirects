export default function handler(req, res) {
  try {
    const SECRET_KEY = "sM3WQvFq9e1D8A7NnH8JcP2X6KkYB9RZsU5V4x";

    const { d } = req.query;
    if (!d) return res.status(400).send("Invalid Request");

    // urlsafe base64 decode
    const normalized = d.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(normalized, "base64").toString("utf-8");

    const [shortUrl, userId, expireAt, key] = decoded.split("|");

    if (key !== SECRET_KEY) {
      return res.status(403).send("Unauthorized");
    }

    if (Math.floor(Date.now() / 1000) > Number(expireAt)) {
      return res.status(410).send("Link Expired");
    }

    // 🔥 Redirect directly to AROLINKS SHORT URL
    return res.redirect(302, shortUrl);

  } catch (e) {
    return res.status(500).send("Server Error");
  }
}
