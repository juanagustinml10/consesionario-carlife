import * as React from 'react';

/**
 * Ilustración vectorial original de una sportbike, creada para JAY MOTOS.
 * Arte de la propia concesionaria — no es una fotografía de inventario ni una marca real.
 * Diseñada en proporción 900x480 para componer con texto en la hero.
 */
export const HeroBike: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 900 480" className={className} role="img" aria-label="Ilustración de motocicleta deportiva JAY MOTOS">
    <defs>
      <radialGradient id="glowRed" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E32636" stopOpacity="0.5" />
        <stop offset="45%" stopColor="#E32636" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#E32636" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="glowWarm" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FF3B47" />
        <stop offset="0.35" stopColor="#E32636" />
        <stop offset="0.75" stopColor="#8F101D" />
        <stop offset="1" stopColor="#5C0811" />
      </linearGradient>
      <linearGradient id="bodyGrad2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#E32636" />
        <stop offset="0.6" stopColor="#A3141F" />
        <stop offset="1" stopColor="#38060C" />
      </linearGradient>
      <linearGradient id="darkMetal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2E2E2E" />
        <stop offset="0.5" stopColor="#1A1A1A" />
        <stop offset="1" stopColor="#0B0B0B" />
      </linearGradient>
      <radialGradient id="rimGrad" cx="35%" cy="35%" r="75%">
        <stop offset="0" stopColor="#3A3A3A" />
        <stop offset="0.55" stopColor="#222222" />
        <stop offset="1" stopColor="#101010" />
      </radialGradient>
      <radialGradient id="rimDark" cx="40%" cy="40%" r="70%">
        <stop offset="0" stopColor="#262626" />
        <stop offset="1" stopColor="#101010" />
      </radialGradient>
      <linearGradient id="forkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C7CCD4" />
        <stop offset="0.4" stopColor="#8B929C" />
        <stop offset="0.75" stopColor="#3A3F46" />
        <stop offset="1" stopColor="#1C1F24" />
      </linearGradient>
      <linearGradient id="tireSide" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1B1B1B" />
        <stop offset="1" stopColor="#050505" />
      </linearGradient>
      <linearGradient id="ledGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FFE9E9" />
      </linearGradient>
      <linearGradient id="exhaustGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2A2A2A" />
        <stop offset="0.6" stopColor="#4A4A4A" />
        <stop offset="1" stopColor="#121212" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A3F46" />
        <stop offset="1" stopColor="#0D0D0F" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="floorGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#E32636" stopOpacity="0" />
        <stop offset="0.5" stopColor="#E32636" stopOpacity="0.35" />
        <stop offset="1" stopColor="#E32636" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Fondo: halo rojo detrás de la moto */}
    <ellipse cx="450" cy="240" rx="430" ry="260" fill="url(#glowRed)" />
    <ellipse cx="600" cy="300" rx="300" ry="200" fill="url(#glowWarm)" />

    {/* Piso / reflejo */}
    <rect x="60" y="428" width="780" height="3" fill="url(#floorGrad)" />
    <ellipse cx="450" cy="436" rx="330" ry="14" fill="#E32636" opacity="0.10" />

    {/* ===== RUEDA TRASERA ===== */}
    <g>
      <circle cx="235" cy="372" r="86" fill="#0A0A0A" stroke="#222222" strokeWidth="4" />
      <circle cx="235" cy="372" r="60" fill="url(#rimGrad)" />
      <circle cx="235" cy="372" r="40" fill="#161616" stroke="#262626" strokeWidth="2" />
      {/* 5 rayos dobles */}
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a} 235 372)`}>
          <rect x="231" y="316" width="8" height="52" rx="4" fill="#2E2E2E" />
          <rect x="245" y="316" width="3" height="52" rx="1.5" fill="#3E3E3E" />
        </g>
      ))}
      {/* disco de freno */}
      <circle cx="235" cy="372" r="24" fill="#141414" stroke="#2C2C2C" strokeWidth="3" />
      <circle cx="235" cy="372" r="24" fill="none" stroke="#3A3A3A" strokeWidth="1" strokeDasharray="3 6" />
      {/* tuerca central roja */}
      <circle cx="235" cy="372" r="9" fill="#E32636" />
      <circle cx="235" cy="372" r="4" fill="#12070a" />
    </g>

    {/* ===== RUEDA DELANTERA ===== */}
    <g>
      <circle cx="668" cy="372" r="86" fill="#0A0A0A" stroke="#222222" strokeWidth="4" />
      <circle cx="668" cy="372" r="60" fill="url(#rimDark)" />
      <circle cx="668" cy="372" r="40" fill="#161616" stroke="#262626" strokeWidth="2" />
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a} 668 372)`}>
          <rect x="664" y="316" width="8" height="52" rx="4" fill="#2E2E2E" />
          <rect x="678" y="316" width="3" height="52" rx="1.5" fill="#3E3E3E" />
        </g>
      ))}
      <circle cx="668" cy="372" r="24" fill="#141414" stroke="#2C2C2C" strokeWidth="3" />
      <circle cx="668" cy="372" r="24" fill="none" stroke="#3A3A3A" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="668" cy="372" r="9" fill="#E32636" />
      <circle cx="668" cy="372" r="4" fill="#12070a" />
    </g>

    {/* ===== BASCULANTE + CADENA ===== */}
    <path d="M 380 330 L 245 380" stroke="#1D1D1D" strokeWidth="14" strokeLinecap="round" />
    <circle cx="250" cy="378" r="15" fill="none" stroke="#2A2A2A" strokeWidth="6" strokeDasharray="4 5" />

    {/* ===== ALETA DELANTERA ===== */}
    <path d="M 590 296 C 660 278 735 292 762 332 L 730 342 C 692 306 636 302 606 310 Z" fill="url(#bodyGrad2)" />

    {/* ===== HORQUILLA DELANTERA ===== */}
    <path d="M 628 256 L 676 372" stroke="url(#forkGrad)" strokeWidth="10" strokeLinecap="round" />
    <path d="M 644 252 L 690 366" stroke="#24262B" strokeWidth="4" strokeLinecap="round" opacity="0.7" />

    {/* ===== CUERPO / CARENADO ===== */}
    {/* cola y colín */}
    <path d="M 158 296 C 210 272 290 264 344 276 L 352 300 C 285 300 216 306 158 306 Z" fill="#141414" />
    <path d="M 158 296 C 210 272 290 264 344 276" fill="none" stroke="#E32636" strokeWidth="3" strokeLinecap="round" />
    {/* colín (asiento) */}
    <path d="M 205 268 C 260 254 330 254 356 264 L 342 276 C 285 270 232 270 200 274 Z" fill="#0C0C0C" stroke="#1E1E1E" strokeWidth="2" />

    {/* tanque + fairing principal */}
    <path d="M 340 262 C 410 232 500 228 558 246 C 614 263 650 300 660 344 L 596 356 C 520 330 392 322 336 296 Z" fill="url(#bodyGrad)" />
    {/* separación/sombra del tanque */}
    <path d="M 415 250 C 470 238 520 240 556 254" fill="none" stroke="#FF6B75" strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />

    {/* difusores y entradas de aire */}
    <path d="M 470 285 C 500 276 540 277 566 288 L 556 300 C 520 288 486 288 460 294 Z" fill="#0D0D0D" opacity="0.75" />

    {/* vientre / panza inferior */}
    <path d="M 340 322 C 440 322 545 332 618 352 L 575 386 C 470 362 385 362 330 344 Z" fill="#101010" stroke="#1F1F1F" strokeWidth="2" />

    {/* trellis: tubos rojos del chasis */}
    <path d="M 372 300 L 452 344" stroke="#E32636" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
    <path d="M 420 288 L 500 332" stroke="#E32636" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
    <path d="M 372 312 L 452 344" stroke="#3B0A10" strokeWidth="2" strokeLinecap="round" />

    {/* escape lateral */}
    <path d="M 336 348 L 218 322" stroke="url(#exhaustGrad)" strokeWidth="20" strokeLinecap="round" />
    <path d="M 236 318 L 206 312" stroke="#5A5A5A" strokeWidth="6" strokeLinecap="round" />

    {/* ===== FRENTE ===== */}
    {/* parabrisas */}
    <path d="M 596 224 C 636 214 668 226 684 254 L 636 260 C 622 240 610 232 588 234 Z" fill="url(#screenGrad)" stroke="#2E3238" strokeWidth="2" />
    {/* óptica LED */}
    <path d="M 656 248 L 712 260 L 700 274 L 648 260 Z" fill="url(#ledGrad)" opacity="0.96" />
    <path d="M 668 250 L 702 258" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />

    {/* faro delantero glow */}
    <ellipse cx="700" cy="268" rx="26" ry="12" fill="#FFFFFF" opacity="0.28" />

    {/* ===== DETALLES ===== */}
    {/* franja blanca lateral */}
    <path d="M 372 342 L 520 328" stroke="#F5F5F5" strokeWidth="6" strokeLinecap="round" opacity="0.92" />
    <path d="M 388 352 L 506 339" stroke="#B81E2C" strokeWidth="3" strokeLinecap="round" opacity="0.9" />

    {/* piernas del piloto: pedal */}
    <path d="M 396 360 L 470 372" stroke="#242424" strokeWidth="5" strokeLinecap="round" />

    {/* bieleta */}
    <path d="M 330 352 L 452 344" stroke="#262626" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

    {/* piloto insinuado: rodilla sobre el tanque */}
    <path d="M 430 268 C 470 252 500 254 512 268 L 500 282 C 462 272 430 276 414 284 Z" fill="#171717" stroke="#242424" strokeWidth="2" />
  </svg>
);
