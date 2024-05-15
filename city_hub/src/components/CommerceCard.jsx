import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Asegúrate de importar correctamente el componente Modal

/*
  FUNCION
    CommerceCard({ cif })
    Componente de tarjeta de comercio que muestra la información de un comercio por su CIF
    Parámetros:
      - cif: CIF del comercio a mostrar
    Return:
      - Tarjeta de comercio con la información del comercio
*/
function CommerceCard({ cif }) {
  const [commerceData, setCommerceData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/comercios/CIF/${cif}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();          
          setCommerceData(data.data);
        } else {
          setModalMessage('No se pudo obtener la información del comercio');
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error al obtener datos del comercio:', error);
        setModalMessage('Error al obtener la información del comercio');
        setShowModal(true);
      }
    };

    fetchData();
  }, [cif]);

  useEffect(() => {
    if (commerceData && commerceData.file && commerceData.file.url) {
      console.log('URL de la imagen:', `http://localhost:3001${commerceData.file.url}`);
    }
  }, [commerceData]);

  return (
    <div className="border border-gray-300 p-4 mb-4 text-center">
      {commerceData ? (
        <>
          <p className="text-gray-700"><span className="font-semibold">Nombre:</span> {commerceData.nombre}</p>
          <p className="text-gray-700"><span className="font-semibold">CIF:</span> {commerceData.CIF}</p>
          <p className="text-gray-700"><span className="font-semibold">Dirección:</span> {commerceData.direccion}</p>
          <p className="text-gray-700"><span className="font-semibold">Correo:</span> {commerceData.correo}</p>
          <p className="text-gray-700"><span className="font-semibold">Teléfono:</span> {commerceData.telefono}</p>
          {commerceData.file && commerceData.file.url ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={`${commerceData.file.url}`}
                alt="Foto del comercio"
                style={{ maxWidth: '200px', maxHeight: '200px', width: 'auto', height: 'auto' }}
              />
            </div>
          ) : (
            <div className="text-gray-700">No hay foto disponible</div>
          )}
        </>
      ) : (
        <div>Cargando...</div>
      )}

      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default CommerceCard;
