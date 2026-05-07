// netlify/functions/portfolio-items.js
//
// This serverless function reads the /public/portfolio/ directory and returns
// all JSON filenames. The React app calls this endpoint so it automatically
// picks up any new items added via Netlify CMS — no code changes needed.
//
// Endpoint: /.netlify/functions/portfolio-items
// Returns:  { items: ["victorian-parlour-chair", "mid-century-credenza", ...] }

const fs = require("fs");
const path = require("path");

exports.handler = async function () {
  try {
    // In Netlify's build environment, the public folder is at the repo root
    const portfolioDir = path.join(process.cwd(), "public", "portfolio");

    if (!fs.existsSync(portfolioDir)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ items: [] }),
      };
    }

    const files = fs.readdirSync(portfolioDir)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ items: files }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
