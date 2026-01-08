export default function handler(req, res) {
  try {
    // 🔐 SAME SECRET KEY AS info.py
    const SECRET_KEY = "sM3WQvFq9e1D8A7NnH8JcP2X6KkYB9RZsU5V4x";

    const { d } = req.query;
    if (!d) {
      return res.status(400).send("Invalid Request");
    }

    // Decode encrypted data
    const decoded = Buffer.from(d, "base64").toString("utf-8");
    const parts = decoded.split("|");

    if (parts.length !== 4) {
      return res.status(400).send("Invalid Token");
    }

    const [botUrl, userId, expireAt, key] = parts;

    // Secret key validation
    if (key !== SECRET_KEY) {
      return res.status(403).send("Unauthorized");
    }

    // Expiry validation
    const now = Math.floor(Date.now() / 1000);
    if (now > Number(expireAt)) {
      return res.status(410).send("Link Expired");
    }

    /*
      🔥 SHORTENER FIRST FLOW
      Shortener must redirect to ?redirect=BOT_URL
    */

    const SHORTENER_DOMAIN = "https://arolinks.com";

    const shortenerLink =
      SHORTENER_DOMAIN +
      "?redirect=" +
      encodeURIComponent(botUrl);

    // Redirect user to shortener
    return res.redirect(302, shortenerLink);

  } catch (err) {
    return res.status(500).send("Server Error");
  }
}
