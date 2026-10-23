import { useState } from "react";
import { demoPrimary, peso } from "./demoStyles";

const menu = [
  { id: 1, name: "Chicken Adobo Rice", price: 120, emoji: "🍛", category: "Meal" },
  { id: 2, name: "Pork Sinigang", price: 150, emoji: "🍲", category: "Meal" },
  { id: 3, name: "Pancit Canton", price: 95, emoji: "🍜", category: "Meal" },
  { id: 4, name: "Halo-halo", price: 85, emoji: "🍧", category: "Dessert" },
  { id: 5, name: "Iced Tea", price: 45, emoji: "🧋", category: "Drink" },
];

export default function OrderDemo() {
  const [cart, setCart] = useState({});
  const [placed, setPlaced] = useState(null);

  const changeQuantity = (id, delta) => {
    setCart((current) => {
      const quantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = { ...current };
      if (quantity === 0) delete next[id];
      else next[id] = quantity;
      return next;
    });
  };

  const items = menu.filter((item) => cart[item.id]);
  const count = items.reduce((total, item) => total + cart[item.id], 0);
  const total = items.reduce((sum, item) => sum + item.price * cart[item.id], 0);

  if (placed) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6 text-center">
        <p className="text-5xl" aria-hidden="true">
          ✅
        </p>
        <h4 className="mt-3 font-display text-xl font-semibold text-slate-950 dark:text-white">
          Order placed
        </h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Order <strong className="text-slate-900 dark:text-white">{placed.number}</strong> ·{" "}
          {placed.count} item{placed.count === 1 ? "" : "s"} · {peso(placed.total)}
        </p>
        <button
          type="button"
          onClick={() => {
            setPlaced(null);
            setCart({});
          }}
          className={`${demoPrimary} mt-5`}
        >
          Start another order
        </button>
        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          Demonstration only — no payment or kitchen order was created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {menu.map((item) => {
          const quantity = cart[item.id] ?? 0;
          return (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 p-3 dark:border-white/10"
            >
              <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-100 text-4xl dark:bg-white/5">
                <span aria-hidden="true">{item.emoji}</span>
              </div>
              <h4 className="mt-2 text-sm font-semibold leading-snug text-slate-950 dark:text-white">
                {item.name}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {item.category} · {peso(item.price)}
              </p>

              {quantity > 0 ? (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-100 p-1 dark:bg-white/5">
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.id, -1)}
                    aria-label={`Remove one ${item.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    −
                  </button>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.id, 1)}
                    aria-label={`Add one ${item.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, 1)}
                  className="mt-2 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-200 dark:hover:text-brand-400"
                >
                  Add to cart
                </button>
              )}
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              Cart · {count} item{count === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
              {count === 0 ? "Your cart is empty." : `Order total: ${peso(total)}`}
            </p>
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={() => {
                setPlaced({
                  number: `#${Math.floor(1000 + Math.random() * 9000)}`,
                  count,
                  total,
                });
                setCart({});
              }}
              className="btn btn-primary px-4 py-2 text-xs"
            >
              Checkout
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        This is a front-end ordering prototype. A production version would send the order to a
        database and payment provider.
      </p>
    </div>
  );
}
