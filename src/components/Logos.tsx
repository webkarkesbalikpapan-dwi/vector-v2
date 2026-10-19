import React from 'react';

export const KemenkesLogo: React.FC<{ className?: string }> = ({ className = 'w-11 h-11' }) => (
  <img
    src="/logos/logo-kemenkes.png"
    alt="Logo Kementerian Kesehatan Republik Indonesia"
    title="Kementerian Kesehatan Republik Indonesia"
    className={`${className} object-contain select-none shrink-0`}
    draggable={false}
  />
);

export const BkkLogo: React.FC<{ className?: string }> = ({ className = 'w-11 h-11' }) => (
  <img
    src="/logos/logo-karantina-kesehatan.png"
    alt="Logo Balai Kekarantinaan Kesehatan - Husada Adyatama"
    title="Balai Kekarantinaan Kesehatan - Husada Adyatama"
    className={`${className} object-contain select-none shrink-0`}
    draggable={false}
  />
);
