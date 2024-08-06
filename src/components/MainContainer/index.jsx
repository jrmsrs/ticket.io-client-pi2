import Modal from "../Modal";
import { useContext } from "react";
import { AuthGoogleContext } from "../../contexts/authGoogle";

function MainContainer({ children }){
  const { signOut } = useContext(AuthGoogleContext);
  return(
    <>
    <div className='container-fluid'>
      <div className="row">
        <main className="container-custom col-sm-11 ms-sm-auto col-lg-9 px-sm-4">
          {children}
        </main>
      </div>
    </div>
    <Modal 
      id="logoutModal"
      title="Encerrar sessão" 
      body="Tem certeza que deseja encerrar sessão?"  
      confirm="Encerrar sessão"
      onClick={() => signOut()}
    />
    
    </>
  )
}

export default MainContainer