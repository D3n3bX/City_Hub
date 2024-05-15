'use client'

// AdminLogin.js
import React, { useState, useEffect } from 'react';
import Login from '@/components/Login';

function CommerceLogin() {
  const [adminInfo, setAdminInfo] = useState({ loggedIn: false, adminId: null }); 
  
  const routeDir = '/commerce/menu'; 
  const apiRoute  = 'http://localhost:3001/api/comercios/login'

  async function handleLogin(credentials) {
    try {
      const response = await fetch('http://localhost:3001/api/comercios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        setAdminInfo({ loggedIn: true, adminId: data.adminId });
      } else {
        console.error('Error al iniciar sesión:', data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-secondary p-8 shadow-md rounded-md'>
        {/* Aquí pasas la prop routeDir al componente Login */}
        <Login
          onLogin={handleLogin}
          routeDir={routeDir}
          apiRoute={apiRoute}
        />
      </div>
    </div>
  );
}

export default CommerceLogin;
