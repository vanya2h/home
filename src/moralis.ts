import Moralis from "moralis";

const apiKey = process.env.MORALIS_API_KEY;

if (!apiKey) {
  throw new Error("Moralis module cannot run outside of server context");
}

await Moralis.start({
  apiKey: apiKey,
});
