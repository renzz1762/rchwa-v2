const { kirimReaksi } = require("../lib/rch");

module.exports = async (req, res) => {
  const { url, reaction } = req.query || {};
  const out = await kirimReaksi(url, reaction);
  res.setHeader("Cache-Control", "no-store");
  res.status(out.code).json(out.body);
};
