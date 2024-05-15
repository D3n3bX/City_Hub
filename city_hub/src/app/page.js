'use client'
import React, { useState, useEffect } from 'react';
import SearchCommerce from '@/components/CommerceSearch';
import CommerceCard from '@/components/CommerceCard';

export default function Home() {
  // Definir los CIFs de los comercios destacados
  const highlightedCIFs = ['A98765430', 'B12345679', 'A18765432'];

  return (
    <div className='bg-quaternary min-h-screen flex flex-col justify-between'>
      <section id='banner' className='bg-secondary text-white text-center py-16'>
        <h1 className='text-4xl font-bold mb-4'>Bienvenido a CityHub</h1>
        <p className='text-lg'>Encuentra y promociona comercios locales</p>
      </section>

      <section id='busqueda-comercios' className='text-center py-8'>
        <SearchCommerce apiRoute="http://localhost:3001/api/comercios/CIF/" routeDir="/" />
      </section>

      <section id='comercios-destacados' className='text-center py-8'>
        <div className="grid grid-cols-3 gap-4">
          {highlightedCIFs.map((cif, index) => (
            <CommerceCard key={index} cif={cif} />
          ))}
        </div>
      </section>
    </div>
  );
}
