import * as React from 'react';
import { ArrowRight, Handshake, Repeat2, Truck, Wallet } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { PageIntro } from '@/components/public/PageIntro';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Reveal } from '@/components/shared/Reveal';
import { BUSINESS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const SERVICES = [
  {
    index: '01',
    icon: <Repeat2 size={24} strokeWidth={1.5} />,
    title: 'Permutas',
    lead: 'Tu próximo auto puede empezar con el que ya tenés.',
    text: 'Si estás buscando cambiar de vehículo, consultanos por tu unidad. Analizamos cada caso y te informamos las opciones disponibles para combinarla con una unidad del catálogo.',
    image: '/images/service-permutas.webp',
  },
  {
    index: '02',
    icon: <Wallet size={24} strokeWidth={1.5} />,
    title: 'Créditos prendarios',
    lead: 'Consultá nuestras opciones de financiación mediante créditos prendarios.',
    text: BUSINESS.financingMessage,
    image: '/images/service-financiacion.webp',
  },
  {
    index: '03',
    icon: <Handshake size={24} strokeWidth={1.5} />,
    title: 'Consignaciones',
    lead: 'Nos encargamos de comercializar tu vehículo.',
    text: 'Si querés vender tu auto, podemos ocuparnos de publicarlo y comercializarlo. Consultanos los detalles de tu vehículo y coordinamos los siguientes pasos.',
    image: '/images/service-consignaciones.webp',
  },
  {
    index: '04',
    icon: <Truck size={24} strokeWidth={1.5} />,
    title: 'Envíos a todo el país',
    lead: 'Tu próximo vehículo puede llegar a cualquier punto de Argentina.',
    text: `Te acompañamos desde la elección hasta la entrega. Consultanos por ${BUSINESS.shippingLabel.toLowerCase()} y coordinamos la forma de entrega que mejor se ajuste a tu ubicación.`,
    image: '/images/service-envios.webp',
  },
];

export const Services: React.FC = () => (
  <div className="bg-white text-cc-black">
    <PageIntro
      eyebrow="CARLIFE · Servicios"
      title={<>Todo lo que necesitás,<br />en un solo lugar</>}
      tone="dark"
      description={
        <p>
          Permutas, créditos prendarios, consignaciones y envíos a todo el país. Te acompañamos en cada etapa de la compra o venta de tu vehículo.
        </p>
      }
      actions={<WhatsAppButton size="lg" label="Consultar por WhatsApp" className="px-8" />}
    />

    <section>
      {SERVICES.map((service, index) => {
        const reverse = index % 2 === 1;
        return (
          <section
            key={service.index}
            className={cn('border-b border-black/10', index % 2 === 0 ? 'bg-white' : 'bg-cc-soft')}
          >
            <div className="container-cc grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:items-center lg:gap-20">
              <Reveal className={cn('lg:col-span-6', reverse && 'lg:order-2')}>
                <div className="flex items-center gap-5">
                  <span className="flex h-14 w-14 items-center justify-center border border-black/25 text-cc-black">
                    {service.icon}
                  </span>
                  <span className="data-num text-xs text-cc-metal">Servicio {service.index} / 04</span>
                </div>
                <h2 className="display-lg mt-9">{service.title}</h2>
                <p className="mt-6 font-display text-xl font-semibold uppercase leading-tight tracking-[-0.04em] text-cc-slate sm:text-2xl">
                  {service.lead}
                </p>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-cc-slate">{service.text}</p>
                <WhatsAppButton
                  message={`Hola! Quisiera consultar por ${service.title.toLowerCase()} en CARLIFE.`}
                  label="Consultar este servicio"
                  className="mt-9 px-7"
                />
              </Reveal>

              <Reveal delay={100} className={cn('lg:col-span-6', reverse && 'lg:order-1')}>
                <div className="aspect-[4/3] w-full overflow-hidden bg-cc-paper sm:aspect-[16/11]">
                  <img
                    src={service.image}
                    alt={`Servicio de ${service.title} en CARLIFE`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}
    </section>

    <section className="section-dark">
      <div className="container-cc flex flex-col items-start justify-between gap-9 py-20 sm:py-28 lg:flex-row lg:items-center">
        <div>
          <span className="eyebrow eyebrow-light">Hablemos</span>
          <h2 className="display-lg mt-6 max-w-2xl text-white">Contanos qué necesitás y te respondemos</h2>
          <p className="mt-6 max-w-md text-sm text-white/55">
            {BUSINESS.address} · {BUSINESS.phoneDisplay} · {BUSINESS.shippingLabel}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <WhatsAppButton size="lg" label="Escribinos por WhatsApp" className="px-8" />
          <Link to="/motos" className="btn btn-outline btn-lg px-8">
            Ver vehículos <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  </div>
);
