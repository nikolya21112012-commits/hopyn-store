exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, amount } = JSON.parse(event.body);
    
    // Берем ключи из настроек Netlify
    const MERCHANT_ID = process.env.PLATEGA_MERCHANT_ID;
    const SECRET = process.env.PLATEGA_SECRET;
    const SITE_URL = "https://hopynreselling.netlify.app/";

    const response = await fetch("https://app.platega.io/v2/transaction/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MerchantId": MERCHANT_ID,
        "X-Secret": SECRET,
      },
      body: JSON.stringify({
        paymentMethod: 2, // 2 = СБП
        paymentDetails: { amount: Number(amount), currency: "RUB" },
        description: "Оплата Blair",
        return: SITE_URL,
        failedUrl: SITE_URL,
        payload: email 
      }),
    });

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify({ url: data.redirect || data.url }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};