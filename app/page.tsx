
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("fetch-ai");
  const [investment, setInvestment] = useState(50);
  const [profitPercent, setProfitPercent] = useState(10);
  const [stopLossPercent, setStopLossPercent] = useState(5);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/list")
      .then((res) => setCoins(res.data.filter(coin => ["fetch-ai", "bitcoin", "ethereum", "solana", "dogecoin"].includes(coin.id))));
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      axios
        .get(`https://api.coingecko.com/api/v3/coins/${selectedCoin}`)
        .then((res) => setData(res.data.market_data));
    }
  }, [selectedCoin]);

  const calculate = () => {
    if (!data) return null;
    const price = data.current_price.eur;
    const targetSell = price * (1 + profitPercent / 100);
    const stopLoss = price * (1 - stopLossPercent / 100);
    const expectedProfit = (investment * profitPercent) / 100;
    const expectedLoss = (investment * stopLossPercent) / 100;

    return { price, targetSell, stopLoss, expectedProfit, expectedLoss };
  };

  const results = calculate();

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Crypto Profit Calculator</h2>

      <select
        className="w-full p-2 border rounded"
        value={selectedCoin}
        onChange={(e) => setSelectedCoin(e.target.value)}
      >
        {coins.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={investment}
        onChange={(e) => setInvestment(Number(e.target.value))}
        placeholder="Investment (€)"
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        value={profitPercent}
        onChange={(e) => setProfitPercent(Number(e.target.value))}
        placeholder="Desired Profit %"
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        value={stopLossPercent}
        onChange={(e) => setStopLossPercent(Number(e.target.value))}
        placeholder="Stop Loss %"
        className="w-full p-2 border rounded"
      />

      {results && (
        <div className="space-y-2">
          <p>💰 Current Price: €{results.price.toFixed(4)}</p>
          <p>🎯 Target Sell Price: €{results.targetSell.toFixed(4)}</p>
          <p>🛑 Stop Loss Price: €{results.stopLoss.toFixed(4)}</p>
          <p>✅ Expected Profit: €{results.expectedProfit.toFixed(2)}</p>
          <p>❌ Possible Loss: €{results.expectedLoss.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
