import * as React from 'react';
import { ArrowRight, MapPin, MessageCircle, Search } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { HeroBike } from '@/components/public/HeroBike';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';
import ktmPhoto from '@/assets/ktm-enduro-promo.jpg';

const PILLARS = [
  { icon: <Search size={24} />, title: 'Catálogo claro', text: 'Cada publicación muestra fotos, datos principales y precio.', n: '01' },
  { icon: <MessageCircle size={24} />, title: 'Consulta directa', text: 'Escribinos por WhatsApp para saber más sobre una unidad.', n: '02' },
  { icon: <MapPin size={24} />, title: 'Punto de encuentro', text: `Vení a vernos a ${BUSINESS.address}.`, n: '03' },
];

export const About: React.FC = () => (
  <div className="bg-sf-black text-sf-white">
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="track-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-sf relative grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <div className="section-index !text-sf-red">01 / Sobre nosotros</div>
          <h1 className="mt-5 font-display text-6xl font-extrabold uppercase leading-[0.82] text-white sm:text-8xl lg:text-9xl">
            SF<br /><span className="text-sf-red">MOTOS</span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-gray-300">
            {BUSINESS.activity}
          </p>
          <div className="mt-8 border-l-2 border-sf-red pl-5">
            <p className="font-display text-3xl font-extrabold uppercase leading-[0.9] text-white sm:text-4xl">
              {BUSINESS.tagline}
            </p>
          </div>
          <a
            href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-red mt-8 px-7 py-4 text-xs"
          >
            Hablemos por WhatsApp <ArrowRight size={16} />
          </a>
        </div>
        <div className="relative lg:col-span-6">
          <div className="border border-white/10 bg-sf-surface/40 p-4 sm:p-6">
            <div className="border border-sf-red/30">
              <HeroBike className="aspect-[15/8] w-full object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-3 left-4 flex items-center gap-3 bg-sf-red px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white sm:left-8">
            0 km <span className="h-1 w-1 bg-white" /> Usadas
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white text-sf-black">
      <div className="container-sf grid gap-8 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="section-index !text-sf-red">Nuestra mirada</span>
          <p className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.85] text-sf-red sm:text-6xl">Más que motos</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-2xl leading-relaxed text-black/75 sm:text-3xl">
            En SF MOTOS vendemos <strong className="text-sf-black">motos 0 km y usadas</strong>.
            Buscamos que encuentres la información que necesitás para elegir.
          </p>
          <p className="mt-6 text-2xl leading-relaxed text-black/75 sm:text-3xl">
            Si querés ver una unidad o consultar por ella, <strong className="text-sf-red">escribinos o pasate por la agencia</strong>.
          </p>
          <div className="mt-8 flex items-center gap-4 border-t border-black/10 pt-6">
            <MapPin size={20} className="shrink-0 text-sf-red" />
            <span className="font-display text-lg font-bold uppercase tracking-[0.15em]">{BUSINESS.address}</span>
          </div>
        </div>
      </div>
    </section>

    <section className="container-sf py-16 sm:py-24">
      <div className="mb-10 flex flex-col gap-5 border-t-2 border-sf-red pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="micro-label text-sf-red">02</span>
          <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.88] text-white sm:text-7xl">
            Cómo <span className="text-sf-red">trabajamos</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-gray-400">Información clara, consultas sin vueltas y un lugar al que podés venir.</p>
      </div>
      <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="group relative bg-sf-surface p-7 transition-colors hover:bg-sf-elevated">
            <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-extrabold text-white/5">{p.n}</span>
            <div className="flex h-12 w-12 items-center justify-center border border-sf-red/40 text-sf-red-soft">
              {p.icon}
            </div>
            <h3 className="mt-6 font-display text-2xl font-extrabold uppercase text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.text}</p>
            <span className="mt-6 block h-[2px] w-8 bg-sf-red transition-all duration-300 group-hover:w-full" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>

    <section className="relative overflow-hidden border-y border-white/10">
      <img src={ktmPhoto} alt="Moto de enduro en un camino de montaña" loading="lazy" className="min-h-[320px] w-full object-cover object-[70%_20%] sm:min-h-[480px]" />
      <div className="absolute inset-0 bg-sf-black/65" aria-hidden="true" />
      <div className="container-sf relative flex min-h-[320px] flex-col justify-center py-14 sm:min-h-[480px]">
        <div className="relative max-w-lg">
          <span className="section-index !text-sf-red">En movimiento</span>
          <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] text-white sm:text-7xl">
            La moto se<br /><span className="text-sf-red">vive afuera</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-200">
            Nos gustan las motos que se usan. Mirá el catálogo, compará modelos y elegí la que mejor va con vos.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-sf-panel">
      <div className="container-sf flex flex-col items-start justify-between gap-8 py-14 sm:py-20 lg:flex-row lg:items-center">
        <div>
          <span className="section-index !text-sf-red">Tu próxima moto</span>
          <p className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.88] text-white sm:text-6xl">
            Empieza <span className="text-sf-red">acá</span>
          </p>
          <p className="mt-3 max-w-md text-sm text-gray-400">{BUSINESS.specialty}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <Link to="/motos" className="btn btn-red px-8 py-4 text-xs">Ver catálogo <ArrowRight size={16} /></Link>
          <Link to="/contacto" className="btn btn-ghost px-8 py-4 text-xs">Contactanos</Link>
        </div>
      </div>
    </section>
  </div>
);
