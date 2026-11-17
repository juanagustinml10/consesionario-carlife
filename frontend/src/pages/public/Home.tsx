import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Flame, Truck, ShieldCheck } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BikeCard } from '@/components/public/BikeCard';
import { bikesService } from '@/services/bikes';
import type { Bike } from '@/types';

export const Home: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    bikesService
      .list({ featured: true, limit: 6 })
      .then(({ data }) => {
        if (!cancelled) setBikes(data);
      })
      .catch(() => {
        if (!cancelled) setBikes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { value: '10+', label: 'años de experiencia', icon: <ShieldCheck size={24} /> },
    { value: '200+', label: 'motos vendidas', icon: <Flame size={24} /> },
    { value: '24/7', label: 'consultas por WhatsApp', icon: <Truck size={24} /> },
  ];

  return (
    <div className="bg-jay-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-jay-black text-jay-white pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_top_left,rgba(227,38,54,0.15),transparent)]" />
        <div className="container-jay relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-jay-red/20 px-4 py-1.5 text-xs font-bold text-jay-red tracking-wide uppercase">
                Concesionaria oficial
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-5xl md:text-7xl font-bold leading-tight text-balance"
              >
                Motocicletas{' '}
                <span className="text-jay-red">0 km y usadas</span>
                <br />
                con el respaldo que buscas
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-lg text-gray-300 max-w-xl leading-relaxed"
              >
                Asesoramiento personalizado, precios transparentes y entrega inmediata.
                Explorá nuestro catálogo y consultanos por WhatsApp sin compromiso.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link
                  to="/motos"
                  className="flex items-center gap-2 px-8 py-4 bg-jay-red text-jay-white font-semibold rounded-lg hover:bg-black transition-colors"
                >
                  Ver catálogo <ArrowRight size={20} />
                </Link>
                <button
                  className="flex items-center gap-2 px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => {
                    const el = document.getElementById('destacadas');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Play size={20} /> Ver destacadas
                </button>
              </motion.div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <ImagePlaceholderHero />
                <div className="absolute inset-0 bg-gradient-to-t from-jay-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-jay-white/95 backdrop-blur p-6 rounded-xl shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-jay-red text-white">
                        <Flame size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-jay-black">Entrega inmediata</p>
                        <p className="text-xs text-jay-black/60">Motos 0 km con stock disponible</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas rápidas */}
      <section className="border-y border-jay-black/5 bg-jay-white/50">
        <div className="container-jay py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-jay-red">{stat.icon}</div>
                <p className="font-display text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-jay-black/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destacadas */}
      <section id="destacadas" className="py-24">
        <div className="container-jay">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold">Motos destacadas</h2>
              <p className="text-sm text-jay-black/50">Selección del mes con entrega prioritaria</p>
            </div>
            <Link
              to="/motos?featured=true"
              className="text-sm font-medium text-jay-red hover:text-jay-black transition-colors"
            >
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="lg:col-span-3 flex flex-col items-center justify-center py-16 text-jay-black/40">
                Cargando motos destacadas...
              </div>
            ) : bikes.length === 0 ? (
              <div className="lg:col-span-3 flex flex-col items-center justify-center py-16 text-jay-black/40">
                No hay motos destacadas cargadas aún.
              </div>
            ) : (
              bikes.map((bike) => (
                <motion.div
                  key={bike.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (bikes.indexOf(bike) + 1) }}
                >
                  <BikeCard bike={bike} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

function ImagePlaceholderHero() {
  const width = 720;
  const height = 500;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      <circle cx="${width * 0.5}" cy="${height * 0.42}" r="${width * 0.18}" fill="none" stroke="#E32636" stroke-width="3"/>
      <text x="50%" y="52%" font-family="system-ui, sans-serif" font-size="22" fill="#666" text-anchor="middle">Foto de prueba de la moto</text>
    </svg>
  `;
  const src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  return <img src={src} alt="Moto de prueba" className="h-full w-full object-cover" loading="lazy" />;
}
