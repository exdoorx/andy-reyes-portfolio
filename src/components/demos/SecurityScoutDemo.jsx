import { useState, useEffect } from "react";

export default function SecurityScoutDemo() {
  const [traffic, setTraffic] = useState([]);
  const [blocked, setBlocked] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const isMalicious = Math.random() > 0.7;
      const packet = {
        id: Date.now(),
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        isMalicious,
      };
      setTraffic((prev) => [...prev.slice(-4), packet]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const block = (packet) => {
    if (packet.isMalicious) setBlocked((b) => b + 1);
    setTraffic((prev) => prev.filter((p) => p.id !== packet.id));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Click malicious traffic (192.168.1.x) to block it! Blocked: {blocked}
      </p>
      <div className="space-y-2">
        {traffic.map((p) => (
          <button
            key={p.id}
            onClick={() => block(p)}
            className={`w-full p-2 rounded ${p.isMalicious ? 'bg-red-500' : 'bg-slate-200'}`}
          >
            Packet: {p.ip} {p.isMalicious ? '(MALICIOUS)' : '(Safe)'}
          </button>
        ))}
      </div>
    </div>
  );
}
