import * as React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Flame } from 'lucide-react';

const STATS = [
  { value: '10+', label: 'años en el mercado', icon: <ShieldCheck size={24} /> },
  { value: '200+', label: 'motos entregadas', icon: <Flame size={24} /> },
  { value: '12+', label: 'marcas oficiales', icon: <Truck size={24} /> },
];

const VALUES = [
  {
    title: 'Calidad certificada',
    text: 'Cada motocicleta pasa por una revisión técnica antes de ponerse a la venta.',
    icon: <ShieldCheck size={24} />,
  },
  {
    title: 'Precios transparentes',
    text: 'Sin sorpresas. El precio publicado es el precio de lista de concesionaria.',
    icon: <Truck size={24} />,
  },
  {
    title: 'Asesoramiento personalizado',
    text: 'Te ayudamos a elegir la moto que mejor se adapte a tu uso y presupuesto.',
    icon: <Flame size={24} />,
  },
];

export const About: React.FC = () => (
  <div className="bg-jay-white">
    <section className="py-24 lg:py-32 bg-jay-black text-jay-white">
      <div className="container-jay">
        <span className="inline-flex items-center gap-2 rounded-full bg-jay-red/20 px-4 py-1.5 text-xs font-bold text-jay-red tracking-wide uppercase">
          Nosotros
        </span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl md:text-7xl font-bold leading-tight mt-4 mb-6 text-balance"
        >
          JAY MOTOS — pasión sobre dos ruedas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-300 max-w-2xl leading-relaxed"
        >
          Somos una concesionaria de motos 0 km y usadas comprometida con la
          transparencia, la calidad y el trato personalizado. Trabajamos con
          las principales marcas para ofrecerte el mejor respaldo en cada
          entrega.
        </motion.p>
      </div>
    </section>

    <section className="py-20">
      <div className="container-jay">
        <h2 className="font-display text-3xl font-bold mb-12 text-center">Por qué elegirnos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-8 rounded-xl border border-jay-black/10 bg-jay-white shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-jay-red/10 flex items-center justify-center text-jay-red mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-sm text-jay-black/60 leading-relaxed">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-y border-jay-black/5">
      <div className="container-jay py-20">
        <h2 className="font-display text-3xl font-bold mb-8 text-center">Estadísticas</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="space-y-3">
              <div className="flex justify-center text-jay-red">{stat.icon}</div>
              <p className="font-display text-4xl font-bold">{stat.value}</p>
              <p className="text-sm text-jay-black/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);
