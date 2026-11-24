import * as React from 'react';
import { ArrowRight, ArrowUpRight, CarFront, MapPin, Search } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { PageIntro } from '@/components/public/PageIntro';
import { WhatsAppButton, WhatsAppIcon } from '@/components/shared/WhatsAppButton';
import { Reveal } from '@/components/shared/Reveal';
import { BUSINESS } from '@/lib/constants';

const PILLARS = [
  { icon: <Search size={22} strokeWidth={1.5} />, title: 'Catálogo claro', text: 'Cada publicación muestra fotos, datos principales y precio.', n: '01' },
  { icon: <WhatsAppIcon size={22} />, title: 'Consulta directa', text: 'Escribinos por WhatsApp para saber más sobre una unidad.', n: '02' },
  { icon: <MapPin size={22} strokeWidth={1.5} />, title: 'Punto de encuentro', text: `Vení a vernos a ${BUSINESS.address}.`, n: '03' },
];

export const About: React.FC = () => (
  <div className="bg-white text-cc-black">
    <PageIntro
      eyebrow="CARLIFE · Sobre nosotros"
      title={<>Estamos en el<br />mismo lugar</>}
      tone="dark"
      description={
        <>
          <p>{BUSINESS.activity} Vení a vernos, mirá las unidades y consultanos sin compromiso.</p>
          <p className="mt-3 text-xs text-white/65">{BUSINESS.institutional}</p>
          <p className="mt-4 flex items-center gap-2 text-xs text-white/55">
            <MapPin size={14} /> {BUSINESS.address}
          </p>
        </>
      }
      actions={<WhatsAppButton size="lg" label="Hablemos por WhatsApp" className="px-8" />}
    >
      <div className="mt-14 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
        {[
          { label: 'Actividad', value: BUSINESS.tagline },
          { label: 'Ubicación', value: 'Yerba Buena, Tucumán' },
          { label: 'Cobertura', value: BUSINESS.shippingLabel },
        ].map((item) => (
          <div key={item.label} className="bg-cc-black p-6">
            <p className="micro-label text-white/45">{item.label}</p>
            <p className="mt-3 font-display text-sm font-bold uppercase leading-tight tracking-tight text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </PageIntro>

    <section className="section-white">
      <div className="container-cc grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center lg:gap-20">
        <Reveal className="lg:col-span-5">
          <span className="eyebrow eyebrow-dark">Nuestra mirada</span>
          <h2 className="display-lg mt-6">Más que <span className="text-cc-metal">autos</span></h2>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-7">
          <p className="font-display text-2xl font-semibold uppercase leading-tight tracking-[-0.045em] text-cc-slate sm:text-4xl">
            En CARLIFE trabajamos con autos usados seleccionados. Buscamos que encuentres la información que necesitás para elegir.
          </p>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-cc-slate">
            Si querés ver una unidad o consultar por ella, escribinos o pasate por la agencia. Estamos en {BUSINESS.address}.
          </p>
          <Link
            to="/motos"
            className="group mt-9 inline-flex min-h-11 items-center gap-3 self-start border-b border-black/25 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cc-slate transition-colors hover:border-black hover:text-black sm:pb-2"
          >
            Explorar el inventario
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>

    <section className="section-light">
      <div className="container-cc py-24 sm:py-32">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 border-t border-black/15 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow eyebrow-dark">Cómo trabajamos</span>
              <h2 className="display-lg mt-6">Sin vueltas</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cc-slate">
              Información clara, consultas directas y un lugar al que podés venir.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-px border border-cc-paper bg-cc-paper md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 80}>
              <article className="group h-full bg-white p-7 transition-colors hover:bg-cc-soft">
                <div className="flex h-12 w-12 items-center justify-center border border-black/25 text-cc-black">{pillar.icon}</div>
                <h3 className="mt-8 font-display text-xl font-bold uppercase tracking-[-0.04em] text-cc-black">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cc-slate">{pillar.text}</p>
                <span className="mt-8 block h-px w-8 bg-cc-black transition-all duration-500 group-hover:w-full" aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section-dark">
      <div className="container-cc grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center lg:gap-20">
        <Reveal className="lg:col-span-7">
          <div className="aspect-[16/10] w-full overflow-hidden bg-cc-carbon">
            <img
              src="/images/editorial-side.webp"
              alt="Detalle de un automóvil"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-5">
          <span className="eyebrow eyebrow-light">En movimiento</span>
          <h2 className="display-lg mt-6 text-white">Nos gustan los vehículos que se usan</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
            Mirá el catálogo, compará modelos y elegí el que mejor va con vos. Si querés verlo en persona, estamos en Yerba Buena.
          </p>
          <Link to="/comparador" className="btn btn-outline mt-9">
            Comparar modelos <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>

    <section className="section-white">
      <div className="container-cc flex flex-col items-start justify-between gap-9 py-20 sm:py-28 lg:flex-row lg:items-center">
        <Reveal>
          <span className="eyebrow eyebrow-dark">Tu próximo vehículo</span>
          <p className="display-lg mt-6">Empieza acá</p>
          <p className="mt-5 max-w-md text-sm text-cc-slate">{BUSINESS.specialty}</p>
        </Reveal>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <Link to="/motos" className="btn btn-dark btn-lg px-8">Ver catálogo <ArrowRight size={16} /></Link>
          <Link to="/contacto" className="btn btn-outline-dark btn-lg px-8">
            <CarFront size={16} /> Contactanos
          </Link>
        </div>
      </div>
    </section>
  </div>
);
