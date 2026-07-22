"use client";

import { useState } from "react";

type ProductCategory =
  | "TODOS"
  | "COMPUTADORAS"
  | "PERIFERICOS"
  | "COMPONENTES";

interface HardwareProduct {
  id: string;
  name: string;
  description: string;
  category: Exclude<ProductCategory, "TODOS">;
  price: number;
  previousPrice?: number;
  stock: number;
  featured?: boolean;
  icon:
    | "pc"
    | "laptop"
    | "mouse"
    | "keyboard"
    | "monitor"
    | "gpu"
    | "ram"
    | "headset";
}

const PRODUCTS: HardwareProduct[] = [
  {
    id: "pc-gamer-fixora",
    name: "PC Gamer FIXORA X1",
    description:
      "Ryzen 7, 32 GB RAM, SSD 1 TB y tarjeta gráfica dedicada para gaming y trabajo profesional.",
    category: "COMPUTADORAS",
    price: 4299,
    previousPrice: 4799,
    stock: 5,
    featured: true,
    icon: "pc",
  },
  {
    id: "laptop-pro",
    name: "Laptop Pro 15",
    description:
      "Laptop de alto rendimiento con procesador Core i7, 16 GB RAM y SSD de 512 GB.",
    category: "COMPUTADORAS",
    price: 3299,
    previousPrice: 3599,
    stock: 8,
    icon: "laptop",
  },
  {
    id: "mouse-rgb",
    name: "Mouse Gamer RGB",
    description:
      "Sensor de alta precisión, seis botones programables y diseño ergonómico.",
    category: "PERIFERICOS",
    price: 119,
    previousPrice: 149,
    stock: 24,
    featured: true,
    icon: "mouse",
  },
  {
    id: "keyboard-mechanical",
    name: "Teclado Mecánico",
    description:
      "Interruptores mecánicos, iluminación RGB y estructura resistente de aluminio.",
    category: "PERIFERICOS",
    price: 249,
    stock: 16,
    icon: "keyboard",
  },
  {
    id: "monitor-24",
    name: "Monitor Gaming 24″",
    description:
      "Panel IPS Full HD, 165 Hz, tiempo de respuesta de 1 ms y tecnología Adaptive Sync.",
    category: "PERIFERICOS",
    price: 789,
    previousPrice: 899,
    stock: 10,
    icon: "monitor",
  },
  {
    id: "headset-pro",
    name: "Audífonos Gaming Pro",
    description:
      "Sonido envolvente, micrófono ajustable y almohadillas de alta comodidad.",
    category: "PERIFERICOS",
    price: 189,
    stock: 14,
    icon: "headset",
  },
  {
    id: "gpu-rtx",
    name: "Tarjeta Gráfica RTX",
    description:
      "Gráficos de alto rendimiento para videojuegos, edición, modelado y renderizado.",
    category: "COMPONENTES",
    price: 1899,
    previousPrice: 2099,
    stock: 6,
    featured: true,
    icon: "gpu",
  },
  {
    id: "ram-32",
    name: "Memoria RAM 32 GB",
    description:
      "Kit de memoria DDR5 de alta velocidad para equipos gaming y estaciones de trabajo.",
    category: "COMPONENTES",
    price: 399,
    stock: 20,
    icon: "ram",
  },
];

const CATEGORIES: Array<{
  value: ProductCategory;
  label: string;
}> = [
  {
    value: "TODOS",
    label: "Todos",
  },
  {
    value: "COMPUTADORAS",
    label: "Computadoras",
  },
  {
    value: "PERIFERICOS",
    label: "Periféricos",
  },
  {
    value: "COMPONENTES",
    label: "Componentes",
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(price);
}

function ProductIcon({
  type,
}: {
  type: HardwareProduct["icon"];
}) {
  if (type === "mouse") {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        className="h-32 w-32"
        aria-hidden="true"
      >
        <rect
          x="32"
          y="12"
          width="56"
          height="96"
          rx="28"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M60 13V48"
          stroke="currentColor"
          strokeWidth="5"
        />
        <rect
          x="55"
          y="24"
          width="10"
          height="20"
          rx="5"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "keyboard") {
    return (
      <svg
        viewBox="0 0 140 100"
        fill="none"
        className="h-32 w-40"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="20"
          width="124"
          height="64"
          rx="10"
          stroke="currentColor"
          strokeWidth="5"
        />
        {Array.from({ length: 24 }).map((_, index) => {
          const row = Math.floor(index / 8);
          const column = index % 8;

          return (
            <rect
              key={index}
              x={18 + column * 14}
              y={30 + row * 14}
              width="9"
              height="8"
              rx="2"
              fill="currentColor"
              opacity="0.8"
            />
          );
        })}
      </svg>
    );
  }

  if (type === "monitor") {
    return (
      <svg
        viewBox="0 0 140 110"
        fill="none"
        className="h-32 w-40"
        aria-hidden="true"
      >
        <rect
          x="10"
          y="10"
          width="120"
          height="76"
          rx="8"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M70 86V100"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M45 101H95"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M20 20H120V72H20V20Z"
          fill="currentColor"
          opacity="0.12"
        />
      </svg>
    );
  }

  if (type === "laptop") {
    return (
      <svg
        viewBox="0 0 140 110"
        fill="none"
        className="h-32 w-40"
        aria-hidden="true"
      >
        <rect
          x="24"
          y="8"
          width="92"
          height="70"
          rx="7"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M11 88H129L120 100H20L11 88Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M34 18H106V67H34V18Z"
          fill="currentColor"
          opacity="0.12"
        />
      </svg>
    );
  }

  if (type === "pc") {
    return (
      <svg
        viewBox="0 0 120 140"
        fill="none"
        className="h-36 w-32"
        aria-hidden="true"
      >
        <rect
          x="24"
          y="6"
          width="72"
          height="128"
          rx="12"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle
          cx="60"
          cy="47"
          r="23"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle
          cx="60"
          cy="47"
          r="11"
          fill="currentColor"
          opacity="0.45"
        />
        <circle
          cx="60"
          cy="101"
          r="17"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle
          cx="83"
          cy="20"
          r="4"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "gpu") {
    return (
      <svg
        viewBox="0 0 150 100"
        fill="none"
        className="h-32 w-40"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="17"
          width="134"
          height="66"
          rx="8"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle
          cx="48"
          cy="50"
          r="22"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle
          cx="102"
          cy="50"
          r="22"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M20 83V93M32 83V93M44 83V93M56 83V93"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
    );
  }

  if (type === "ram") {
    return (
      <svg
        viewBox="0 0 150 90"
        fill="none"
        className="h-32 w-40"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="22"
          width="134"
          height="46"
          rx="7"
          stroke="currentColor"
          strokeWidth="5"
        />
        {Array.from({ length: 6 }).map((_, index) => (
          <rect
            key={index}
            x={20 + index * 19}
            y="32"
            width="13"
            height="25"
            rx="2"
            fill="currentColor"
            opacity="0.65"
          />
        ))}
        <path
          d="M23 68V78M38 68V78M53 68V78M97 68V78M112 68V78M127 68V78"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className="h-32 w-32"
      aria-hidden="true"
    >
      <path
        d="M28 44C28 23 42 12 60 12C78 12 92 23 92 44V79C92 95 82 106 69 106H51C38 106 28 95 28 79V44Z"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path
        d="M28 61H18V81H29M92 61H102V81H91"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M47 93H73"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M3 4H5L7.2 14.2C7.4 15.2 8.3 16 9.4 16H17.4C18.4 16 19.3 15.3 19.6 14.3L21 8H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="20"
        r="1.5"
        fill="currentColor"
      />
      <circle
        cx="18"
        cy="20"
        r="1.5"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HardwarePage() {
  const [category, setCategory] =
    useState<ProductCategory>("TODOS");

  const [search, setSearch] =
    useState("");

  const [cart, setCart] =
    useState<Record<string, number>>({});

  const [cartOpen, setCartOpen] =
    useState(false);

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredProducts =
    PRODUCTS.filter((product) => {
      const matchesCategory =
        category === "TODOS" ||
        product.category === category;

      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.description
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

  const cartProducts =
    PRODUCTS.filter(
      (product) =>
        (cart[product.id] ?? 0) > 0,
    );

  const cartQuantity =
    cartProducts.reduce(
      (total, product) =>
        total +
        (cart[product.id] ?? 0),
      0,
    );

  const cartTotal =
    cartProducts.reduce(
      (total, product) =>
        total +
        product.price *
          (cart[product.id] ?? 0),
      0,
    );

  function addToCart(
    productId: string,
  ): void {
    setCart((currentCart) => ({
      ...currentCart,
      [productId]:
        (currentCart[productId] ?? 0) +
        1,
    }));

    setCartOpen(true);
  }

  function decreaseQuantity(
    productId: string,
  ): void {
    setCart((currentCart) => {
      const currentQuantity =
        currentCart[productId] ?? 0;

      if (currentQuantity <= 1) {
        const updatedCart = {
          ...currentCart,
        };

        delete updatedCart[productId];

        return updatedCart;
      }

      return {
        ...currentCart,
        [productId]:
          currentQuantity - 1,
      };
    });
  }

  function removeFromCart(
    productId: string,
  ): void {
    setCart((currentCart) => {
      const updatedCart = {
        ...currentCart,
      };

      delete updatedCart[productId];

      return updatedCart;
    });
  }

  function finishPurchase(): void {
    if (cartProducts.length === 0) {
      return;
    }

    window.alert(
      `Compra preparada por ${formatPrice(cartTotal)}. El siguiente paso será conectar el pago real.`,
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030706] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-52 -top-52 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute -bottom-56 -right-52 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      <section className="relative mx-auto max-w-[1600px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/85 px-6 py-14 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:px-10 lg:px-16 lg:py-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="absolute right-[-120px] top-[-100px] h-96 w-96 rounded-full bg-emerald-400/10 blur-[100px]" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Hardware FIXORA
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                Tecnología para llevar tu equipo al{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-cyan-300 bg-clip-text text-transparent">
                  siguiente nivel
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                Compra computadoras, laptops, mouse, teclados,
                monitores y componentes para gaming, trabajo y
                productividad.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#productos"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,185,129,0.25)]"
                >
                  Ver productos
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setCartOpen(true)
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-black text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                >
                  <CartIcon />
                  Ver carrito
                </button>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                {[
                  ["+40", "Productos"],
                  ["100%", "Garantía"],
                  ["24 h", "Atención"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                  >
                    <strong className="block text-xl font-black text-white sm:text-2xl">
                      {value}
                    </strong>

                    <span className="mt-1 block text-xs text-zinc-500">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto flex min-h-[390px] w-full max-w-xl items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full border border-emerald-400/20 bg-emerald-400/10 blur-sm" />

              <div className="absolute h-96 w-96 rounded-full border border-cyan-400/10" />

              <div className="relative flex h-72 w-64 items-center justify-center rounded-[2.2rem] border border-white/10 bg-black/50 text-emerald-300 shadow-[0_30px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                <ProductIcon type="pc" />

                <span className="absolute bottom-5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-300">
                  Potencia FIXORA
                </span>
              </div>
            </div>
          </div>
        </div>

        <section
          id="productos"
          className="scroll-mt-24 py-20"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Catálogo tecnológico
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Encuentra el hardware que necesitas
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Equipos completos, periféricos y componentes listos
                para agregar al carrito.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setCartOpen(true)
              }
              className="relative inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-300 transition hover:bg-emerald-400/20"
            >
              <CartIcon />
              Mi carrito

              {cartQuantity > 0 ? (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-400 px-2 text-[11px] font-black text-zinc-950">
                  {cartQuantity}
                </span>
              ) : null}
            </button>
          </div>

          <div className="mt-9 rounded-3xl border border-white/10 bg-zinc-950/75 p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <label className="relative block">
                <span className="sr-only">
                  Buscar productos
                </span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m16 16 5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.currentTarget.value,
                    )
                  }
                  placeholder="Buscar PC, mouse, monitor, memoria RAM..."
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/35 focus:ring-2 focus:ring-emerald-400/10"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCategory(item.value)
                    }
                    className={
                      category === item.value
                        ? "min-h-11 rounded-xl border border-emerald-400/30 bg-emerald-400/15 px-4 py-2 text-sm font-black text-emerald-300"
                        : "min-h-11 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-bold text-zinc-400 transition hover:border-emerald-400/25 hover:text-emerald-300"
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const quantity =
                  cart[product.id] ?? 0;

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/85 shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
                  >
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500/10 via-zinc-950 to-cyan-500/10 text-emerald-300">
                      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />

                      <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

                      <div className="relative transition duration-300 group-hover:scale-110">
                        <ProductIcon
                          type={product.icon}
                        />
                      </div>

                      {product.featured ? (
                        <span className="absolute left-4 top-4 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.09em] text-amber-300">
                          Destacado
                        </span>
                      ) : null}

                      <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-bold text-zinc-300 backdrop-blur-md">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-400">
                        {product.category}
                      </span>

                      <h3 className="mt-2 text-xl font-black text-white">
                        {product.name}
                      </h3>

                      <p className="mt-3 min-h-20 text-sm leading-6 text-zinc-400">
                        {product.description}
                      </p>

                      <div className="mt-5 flex items-end justify-between gap-3">
                        <div>
                          {product.previousPrice ? (
                            <span className="block text-xs text-zinc-600 line-through">
                              {formatPrice(
                                product.previousPrice,
                              )}
                            </span>
                          ) : null}

                          <strong className="block text-2xl font-black text-white">
                            {formatPrice(product.price)}
                          </strong>
                        </div>

                        {quantity > 0 ? (
                          <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                            {quantity} en carrito
                          </span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(product.id)
                        }
                        disabled={
                          quantity >= product.stock
                        }
                        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-sm font-black text-white transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_32px_rgba(16,185,129,0.22)] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <CartIcon />

                        {quantity >= product.stock
                          ? "Stock agregado"
                          : "Agregar al carrito"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950/75 px-6 py-20 text-center">
              <h3 className="text-xl font-black">
                No encontramos productos
              </h3>

              <p className="mt-3 text-sm text-zinc-500">
                Cambia la búsqueda o selecciona otra categoría.
              </p>
            </div>
          )}
        </section>
      </section>

      {cartOpen ? (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Cerrar carrito"
            onClick={() =>
              setCartOpen(false)
            }
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-white/10 bg-[#070b09] shadow-[-25px_0_70px_rgba(0,0,0,0.5)]">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400">
                  Compra Hardware
                </span>

                <h2 className="mt-1 text-2xl font-black">
                  Mi carrito
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCartOpen(false)
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-zinc-300 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
              >
                ×
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              {cartProducts.length > 0 ? (
                <div className="space-y-4">
                  {cartProducts.map((product) => {
                    const quantity =
                      cart[product.id] ?? 0;

                    return (
                      <article
                        key={product.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300">
                            <div className="scale-[0.45]">
                              <ProductIcon
                                type={product.icon}
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-black text-white">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-sm font-bold text-emerald-300">
                              {formatPrice(product.price)}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center rounded-xl border border-white/10 bg-black/30">
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      product.id,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center text-lg font-bold text-zinc-300 transition hover:text-emerald-300"
                                >
                                  −
                                </button>

                                <span className="min-w-9 text-center text-sm font-black">
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  disabled={
                                    quantity >=
                                    product.stock
                                  }
                                  onClick={() =>
                                    addToCart(
                                      product.id,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center text-lg font-bold text-zinc-300 transition enabled:hover:text-emerald-300 disabled:opacity-30"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(
                                    product.id,
                                  )
                                }
                                className="text-xs font-bold text-red-400 transition hover:text-red-300"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-zinc-500">
                    <CartIcon />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Tu carrito está vacío
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                    Agrega una PC, mouse, monitor u otro producto
                    para comenzar tu compra.
                  </p>
                </div>
              )}
            </div>

            <footer className="border-t border-white/10 bg-zinc-950/95 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-zinc-400">
                  Total de la compra
                </span>

                <strong className="text-2xl font-black text-white">
                  {formatPrice(cartTotal)}
                </strong>
              </div>

              <button
                type="button"
                disabled={
                  cartProducts.length === 0
                }
                onClick={
                  finishPurchase
                }
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-sm font-black text-white transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_15px_35px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar con la compra
              </button>
            </footer>
          </aside>
        </div>
      ) : null}
    </main>
  );
}