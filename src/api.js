const API_KEY =
  "a227bc6b743a0095a1d1a891f638c1316cff14f01d93241bbdbc419150af5b8d";

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

const AGGREGATE_INDEX = 5;

socket.addEventListener("message", e => {
  const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, PARAMETER, MESSAGE} = JSON.parse(e.data);

  if (type === "500") {
    const invalidCurrency = PARAMETER.split("~")[2];
    const handlers = tickersHandlers.get(invalidCurrency) ?? [];
    channelPrices.postMessage({ invalidCurrency, MESSAGE });
    handlers.forEach(fn => fn(MESSAGE));
    return;
  }
  if (type != AGGREGATE_INDEX || newPrice === undefined) {
    return;
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
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};
