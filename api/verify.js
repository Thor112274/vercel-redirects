export default function handler(req, res) {
  try {
    const SECRET_KEY = "MovieLoverzz_2026@SecureKey"; // SAME as info.py

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
