'use client'
import React, { useState } from 'react'
import Modal from './Modal' // Asegúrate de importar correctamente el componente Modal

/*
  FUNCION
    SearchCommerce({ apiRoute, routeDir })
    Componente de búsqueda de comercios que permite buscar un comercio por su CIF
    Parámetros:
      - apiRoute: Ruta de la API utilizada para realizar la búsqueda del comercio
      - routeDir: Dirección a la que se redirigirá después de realizar la búsqueda
    Return:
      - Formulario de búsqueda de comercios por CIF y resultados de búsqueda mostrados en pantalla
*/
function SearchCommerce({ apiRoute, routeDir }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
  
    try {
      const response = await fetch(`http://localhost:3001/api/comercios/${searchTerm}`, {
        method: 'GET',
      })
      console.log('Respuesta de la API:', response); // Agrega esta línea para verificar la respuesta de la API
      const data = await response.json()
      console.log('Datos recibidos:', data); // Agrega esta línea para verificar los datos recibidos
        
      if (response.ok) {
        if (Array.isArray(data.data)) { // Verifica si es un array de resultados
          setSearchResults(data.data)
        } else if (data.data) { // Verifica si es un único resultado
          setSearchResults([data.data])
        } else {
          setModalMessage('No se encontraron resultados')
          setShowModal(true)
          setSearchResults([])
        }
      } else {
        setModalMessage('El CIF no es válido')
        setShowModal(true)
        setSearchResults([])
      }
  
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error)
    }
  }
  
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <h2 className="text-3xl font-semibold mb-6 text-center text-primary">Buscador de Comercios</h2>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center border-b border-gray-300 py-2">
            <input
              type="text"
              placeholder="Buscar por CIF/, Actividad/ o Ciudad/"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 mr-2 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Muestra los resultados */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Resultados de la búsqueda:</h2>
            {searchResults.map((result, index) => (
              <div key={index} className="border border-gray-300 p-4 mb-4">
                <p className="text-gray-700"><span className="font-semibold">Nombre:</span> {result.nombre}</p>
                <p className="text-gray-700"><span className="font-semibold">CIF:</span> {result.CIF}</p>
                <p className="text-gray-700"><span className="font-semibold">Dirección:</span> {result.direccion}</p>
                <p className="text-gray-700"><span className="font-semibold">Correo:</span> {result.correo}</p>
                <p className="text-gray-700"><span className="font-semibold">Teléfono:</span> {result.telefono}</p>
              </div>
            ))}
          </div>
        )}

        {/* Si no hay resultados */}
        {searchResults.length === 0 && searchTerm && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-red-500">Sin resultados</h2>
          </div>
        )}

        {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
      </div>
    </div>
  )
}

export default SearchCommerce
