import Image from "next/image";
import "./page.css";

export default function Home() {
  return (
      <div className='main'>
          <h1 className='title'>Bem-vindo ao Sistema de Interações</h1>
          <p className='text'>
              Este é um sistema para gerenciar interações entre membros e igrejas.
          </p>
          <Image className='logo' src='/logo.png' alt='Igreja' width={300} height={300} />
          <div className='divLinks'>
              <a href='/login' className='primario'>
                  Login
              </a>
              <a href='/formulario' className='secundario'>
                  Enviar Interação
              </a>
          </div>
      </div>
  )
}
