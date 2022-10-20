const path = require("path");
const axios = require("axios");
const { getWalletRegistryUrl, formatMobileRegistryEntry } = require("@walletconnect/utils");

const { formatJson, writeFile } = require("../../../../scripts/shared");

const PKG_DIR = path.join(__dirname, "../");
const FILE_NAME = "registry.json";
const FILE_PATH = path.join(PKG_DIR, FILE_NAME);

function formatMobileRegistry(registry) {
  return Object.values(registry)
    .filter(entry => !!entry.mobile.universal || !!entry.mobile.native)
    .map(formatMobileRegistryEntry);
}

async function format() {
  const url = getWalletRegistryUrl();
  const { data } = await axios.get(url);
  const registry = formatMobileRegistry(data);
  await writeFile(FILE_PATH, formatJson(registry));
}

format();
