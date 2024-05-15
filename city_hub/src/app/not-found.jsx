import React from 'react'

function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center">
        <svg className="w-24 h-24 text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">404 Not Found</h1>
        <p className="text-gray-600 mb-4">La página que buscas no existe.</p>
        <a href="/" className="text-secondary hover:underline">Volver a la página principal</a>
      </div>
    </div>
  )
}

export default NotFound
