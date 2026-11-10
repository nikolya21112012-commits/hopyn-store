exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    console.log("Пришел ответ от Platega:", data);

    if (data.status === "CONFIRMED") {
      console.log(`Оплата прошла! Клиент: ${data.payload}`);
    }
    return { statusCode: 200, body: "OK" };
  } catch (error) {
    return { statusCode: 500, body: "Error" };
  }
};