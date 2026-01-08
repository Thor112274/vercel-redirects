export default function handler(req, res) {
  try {
    const SECRET_KEY = "sM3WQvFq9e1D8A7NnH8JcP2X6KkYB9RZsU5V4x"; // SAME as info.pyok

    const { d } = req.query;
    if (!d) {
      return res.status(400).send("Invalid Request");
    }

    // Decode base64 token
    const decoded = Buffer.from(d, "base64").toString("utf-8");
    const parts = decoded.split("|");

    if (parts.length !== 4) {
      return res.status(400).send("Invalid Token");
    }

    const [redirectUrl, userId, expireAt, key] = parts;

    // Secret key validation
    if (key !== SECRET_KEY) {
      return res.status(403).send("Unauthorized");
    }

    // Expiry validation
    const now = Math.floor(Date.now() / 1000);
    if (now > Number(expireAt)) {
      return res.status(410).send("Link Expired");
    }

    // ✅ All checks passed → redirect
    return res.redirect(302, redirectUrl);

  } catch (err) {
    return res.status(500).send("Server Error");
  }
}
