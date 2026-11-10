exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, amount } = JSON.parse(event.body);
    
    const MERCHANT_ID = process.env.PLATEGA_MERCHANT_ID;
    const SECRET = process.env.PLATEGA_SECRET;
    const SITE_URL = "https://hopynreselling.netlify.app/";

    const response = await fetch("https://app.platega.io/transaction/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MerchantId": MERCHANT_ID,
        "X-Secret": SECRET,
      },
      body: JSON.stringify({
        paymentMethod: 2, // 2 = СБП
        paymentDetails: { 
          amount: Number(amount), 
          currency: "RUB" 
        },
        description: "Оплата Blair",
        return: SITE_URL,
        // Вот то самое обязательное поле!
        metadata: {
          user_email: email
        }
      }),
    });

    const data = await response.json();
    
    // Выводим ответ в логи Netlify, чтобы если что-то пойдет не так, мы увидели причину
    console.log("Ответ от Platega:", data);

    if (!response.ok) {
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: data.message || data.error || "Ошибка Platega" }) 
      };
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ url: data.redirect || data.url }) 
    };
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
