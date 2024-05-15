'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi' // Import icons

/*
  FUNCION
    NavBar()
    Componente de barra de navegación que muestra enlaces a diferentes páginas y un menú desplegable en dispositivos móviles
    Return:
      - Barra de navegación con enlaces y menú desplegable
*/
function NavBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  return (
    <nav className='bg-secondary p-3 fixed w-full z-50 flex items-center justify-between'>
      {/* Título a la izquierda */}
      <div className='text-text text-2xl'>CityHub</div>

      {/* Menú visible en pantallas grandes */}
      <ul className='gap-6 hidden lg:flex'>
        <NavItem href='/'>Home</NavItem>
        <NavItem href='/user/Login'>Registered Users</NavItem>
        <NavItem href='/commerce/Login'>Commerce</NavItem>
      </ul>

      {/* Iniciar sesión y registrarse a la derecha */}
      <ul className='hidden lg:flex gap-6 items-center'>
        <NavItemWithIcon href='/admin/Login' icon={<HiOutlineUser />}>
          Log in
        </NavItemWithIcon>
      </ul>

      {/* Sidebar para pantallas pequeñas */}
      <button
        className='lg:hidden block text-text hover:text-white focus:text-white'
        onClick={toggleSidebar}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
          />
        </svg>
      </button>

      {/* Sidebar para pantallas pequeñas */}
      <div
        className={`${
          isSidebarOpen ? 'right-0' : '-right-full'
        } w-64 bg-secondary top-0 bottom-0 fixed z-40 transition duration-300 ease-in-out transform`}
      >
        <div className='p-6'>
          <button
            className='text-text hover:text-white focus:text-white'
            onClick={toggleSidebar}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        <ul className='mt-12'>
          <NavItem href='/'>Home</NavItem>
          <NavItem href='/admin/Login' icon={<HiOutlineLockClosed />} /> {/* Icono de candado */}
          <NavItem href='/user/Login'>Registered Users</NavItem>
          <NavItem href='/commerce/Login'>Commerce</NavItem>
        </ul>
      </div>
    </nav>
  )
}

/*
  FUNCION
    NavItem({ href, children })
    Componente para los elementos de la barra de navegación que solo contienen texto
    Parámetros:
      - href: URL a la que se redirigirá al hacer clic en el elemento
      - children: Contenido del elemento, generalmente texto
    Return:
      - Elemento de lista que contiene un enlace con el texto proporcionado
*/
function NavItem({ href, children }) {
  return (
    <li>
      <Link href={href} className='text-text hover:text-white'>
        {children}
      </Link>
    </li>
  )
}

/*
  FUNCION
    NavItemWithIcon({ href, icon, children })
    Componente para los elementos de la barra de navegación que incluyen un icono junto al texto
    Parámetros:
      - href: URL a la que se redirigirá al hacer clic en el elemento
      - icon: Icono que se mostrará junto al texto del enlace
      - children: Contenido del elemento, generalmente texto
    Return:
      - Elemento de lista que contiene un enlace con un icono y el texto proporcionado
*/
function NavItemWithIcon({ href, icon, children }) {
  return (
    <li>
      <Link href={href} className='flex items-center text-text hover:text-white'>
        {icon}
        <span className='ml-2'>{children}</span>
      </Link>
    </li>
  )
}

export default NavBar
