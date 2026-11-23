import * as React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from '@/components/shared/Link';

export const NotFound: React.FC = () => (
  <section className="flex min-h-[78vh] items-center bg-white pt-24">
    <div className="container-cc py-16">
      <span className="eyebrow eyebrow-dark">Error 404</span>
      <p className="display-xl mt-7 text-cc-black">Página no encontrada</p>
      <p className="mt-7 max-w-lg text-sm leading-relaxed text-cc-slate">
        La página que buscás no existe o cambió de dirección. Podés volver al inicio o explorar el inventario de vehículos.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn btn-dark px-7">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <Link to="/motos" className="btn btn-outline-dark px-7">
          <Compass size={16} /> Explorar vehículos
        </Link>
      </div>
    </div>
  </section>
);
