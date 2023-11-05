// Definir la URL de la API de mindicador.cl
const API_URL = "https://mindicador.cl/api/";

// Obtener referencias a elementos HTML
const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("currency");
const convertButton = document.getElementById("convert");
const resultDiv = document.getElementById("result");
const chartCanvas = document.getElementById("chart").getContext("2d");

// Agregar un evento de clic al botón de conversión
convertButton.addEventListener("click", () => {
  // Obtener la cantidad y la moneda seleccionada
  const amount = parseFloat(amountInput.value);
  const currency = currencySelect.value;

  // Realizar la solicitud a la API
  fetch(`${API_URL}${currency}`)
    .then((response) => response.json())
    .then((data) => {
      // Obtener el valor de la moneda
      const exchangeRate = data.serie[0].valor;

      // Calcular el resultado de la conversión
      const result = amount / exchangeRate;

      // Mostrar el resultado en el DOM
      resultDiv.innerHTML = `${amount} pesos chilenos son aproximadamente ${result.toFixed(
        2
      )} ${data.codigo} (1 ${data.codigo} = ${exchangeRate} CLP)`;

      // Mostrar el historial de los últimos 10 días en un gráfico
      const historicalData = data.serie.slice(0, 10);
      const dates = historicalData.map((entry) => {
        // Formato de fecha que se muestra en el gráfico
        const date = new Date(entry.fecha);
        return new Intl.DateTimeFormat("es", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date);
      });

      const values = historicalData.map((entry) => entry.valor);

      const chart = new Chart(chartCanvas, {
        type: "line",
        data: {
          labels: dates.reverse(),
          datasets: [
            {
              label: `Valor de ${data.codigo} en los últimos 10 días`,
              data: values.reverse(),
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        },
      });
    })
    .catch((error) => {
      resultDiv.innerHTML =
        "Error al obtener el valor de la moneda. Inténtalo de nuevo.";
    });
});
