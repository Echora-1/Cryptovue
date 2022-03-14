const API_KEY =
  "a227bc6b743a0095a1d1a891f638c1316cff14f01d93241bbdbc419150af5b8d";
const AGGREGATE_INDEX = 5;
let BTC_PRICE = 0;

const channelPrices = new BroadcastChannel("channel");

channelPrices.onmessage = function(ev) {
  const { currency, newPrice } = ev.data;
  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach(fn => fn(newPrice));
};

const tickersHandlers = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", e => {
  let {TYPE: type, FROMSYMBOL: currency, TOSYMBOL: toCurrency, PRICE: newPrice, PARAMETER, MESSAGE} = JSON.parse(e.data);
  let toCurrencyInvalid;
  if (PARAMETER) {
    toCurrencyInvalid = PARAMETER.split("~")[3] ?? "";
  }

  if (currency === "BTC" && newPrice !== undefined) {
    BTC_PRICE = newPrice;
  }

  if (type === "500" && toCurrencyInvalid === "USD" && MESSAGE === 'INVALID_SUB') {
    const invalidCurrency = PARAMETER.split("~")[2];
    subscribeToTickerBtcOnWs(invalidCurrency);
    return;
  }

  if (type === "500" && toCurrencyInvalid === "BTC" && MESSAGE === 'INVALID_SUB') {
    const invalidCurrency = PARAMETER.split("~")[2];
    const handlers = tickersHandlers.get(invalidCurrency) ?? [];
    channelPrices.postMessage({ invalidCurrency, MESSAGE });
    handlers.forEach(fn => fn(MESSAGE));
    return;
  }

  if (type != AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  if (toCurrency === "BTC") {
    newPrice = BTC_PRICE * newPrice;
  }
  const handlers = tickersHandlers.get(currency) ?? [];
  channelPrices.postMessage({ currency, newPrice });
  handlers.forEach(fn => fn(newPrice));
});

function sendToWebsocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebsocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebsocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
  sendToWebsocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~BTC`]
  });
}

function subscribeToTickerBtcOnWs(ticker) {
  sendToWebsocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~BTC`]
  });
}

function subscribeBtcToUsdOnWs() {
  sendToWebsocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~BTC~USD`]
  });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  if (ticker !== "BTC") {
    subscribeToTickerOnWs(ticker);
  }
  if (ticker === "BTC") {
    const handlers = tickersHandlers.get("BTC") ?? [];
    handlers.forEach(fn => fn(BTC_PRICE.toString().split(".")[0]));
  }
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
  if (ticker !== "BTC") {
    unsubscribeFromTickerOnWs(ticker);
  }
};

export const getAllTickers = () => {
  return fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  ).then(r => r.json());
};

subscribeBtcToUsdOnWs();
