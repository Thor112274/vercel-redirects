import crypto from "crypto";

const BOT_USERNAME = "link_sharingg_bot"; // without @
const SECRET_KEY = process.env.SECRET_KEY;

function verifyToken(token) {
  try {
    const raw = Buffer.from(token, "base64url").toString();
    const [data, signature] = raw.split(".");

    const expected = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(data)
      .digest("hex");

    if (signature !== expected) return null;

    const payload = JSON.parse(data);

    if (Date.now() / 1000 > payload.e) return null;

    return payload;
  } catch {
    return null;
  }
}

export default function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(403).send("Invalid Request");

  const payload = verifyToken(token);
  if (!payload) return res.status(403).send("Verification Failed");

  const ua = (req.headers["user-agent"] || "").toLowerCase();
  if (["bot", "curl", "wget", "python"].some(x => ua.includes(x))) {
    return res.status(403).send("Bot Access Denied");
  }

  res.writeHead(302, {
    Location: `https://t.me/${BOT_USERNAME}?start=verified_${payload.u}`
  });
  res.end();
}
