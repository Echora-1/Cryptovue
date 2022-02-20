const API_KEY =
  "a227bc6b743a0095a1d1a891f638c1316cff14f01d93241bbdbc419150af5b8d";

const tickersHandlers = new Map();

const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys()
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then(r => r.json())
    .then(rawData => {
      const updatePrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );
      Object.entries(updatePrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) || [];
        handlers.forEach(fn => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers,5000)
