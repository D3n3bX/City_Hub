import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Modal from './Modal'

function Login({ onLogin, routeDir, apiRoute }) {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    correo: '',
    password: '',
  });

  const [isLoading, setLoading] = useState(false);
  const [isErrorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value,
    }));
  }

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(apiRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login exitoso');
        console.log(routeDir); // Aquí debería imprimir la ruta
        router.push(routeDir); // Aquí rediriges a la ruta
      } else if (response.status === 404) {
        setErrorModalVisible(true);
        setErrorMessage('El correo proporcionado no existe');
      } else {
        console.error('Credenciales inválidas');
        setErrorModalVisible(true);
        setErrorMessage('Credenciales inválidas. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorModalVisible(true);
      setErrorMessage('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center p-6 bg-tertiary'>
      <div className='max-w-sm mx-auto p-6 bg-quaternary shadow-md rounded-md'>
        <h2 className='text-2xl font-semibold mb-4 text-primary'>Iniciar Sesión</h2>
        <div className='mb-4'>
          <label className='block text-primary-700 text-sm mb-2 text-primary' htmlFor='correo'>
            Correo:
            <input
              type='text'
              id='correo'
              name='correo'
              value={credentials.correo}
              onChange={handleInputChange}
              className='mt-1 p-2 border rounded w-full text-primary'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-primary-700 text-sm mb-2 text-primary' htmlFor='password'>
            Contraseña:
            <input
              type='password'
              id='password'
              name='password'
              value={credentials.password}
              onChange={handleInputChange}
              className='mt-1 p-2 border rounded w-full text-primary'
            />
          </label>
        </div>
        <div className="flex justify-between">
          <Link href="../registerUser" className="align-start text-xs font-thin text-primary hover:underline">¿Aún no tienes una cuenta? Crear una cuenta</Link>
        </div>
        <button
          type='submit'
          onClick={handleLogin}
          disabled={isLoading}
          className='bg-tertiary text-primary p-2 rounded hover:bg-secondary transition duration-300'
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        {isErrorModalVisible && (
          <Modal message={errorMessage} onClose={() => setErrorModalVisible(false)} />
        )}
      </div>
    </div>
  );
}

export default Login;
