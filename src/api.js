const API_KEY =
  "a227bc6b743a0095a1d1a891f638c1316cff14f01d93241bbdbc419150af5b8d";

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = 5;

socket.addEventListener("message", e => {
  const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
  if (type != AGGREGATE_INDEX) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach(fn => fn(newPrice));
});

function subscribeToTickerOnWs(ticker) {
  const message = JSON.stringify({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(message);
    },
    { once: true }
  );
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
};

