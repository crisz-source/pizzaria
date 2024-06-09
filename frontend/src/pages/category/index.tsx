import  Head  from "next/head"
import { Header } from "../../componets/Header";
import styles from './styles.module.scss';
import { useState, FormEvent } from "react";
import { setupAPIClient } from "@/src/services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";


export default function Category(){

  const [name, setName] = useState('');

  //assim que o usuário clicar em cadastrar uma nova categoria, essa função será chamada
  async function handleRegister(event: FormEvent){
event.preventDefault();

  if(name == ''){
    return;
  }

  const apiClient = setupAPIClient();

  await apiClient.post('/categorias', {
    name: name
  })

  toast.success("Categoria cadastrada com sucesso");

  setName('');
    

  }


  return(
    <>
    <Head>
      <title>Nova categoria - Sujeito pizzaria</title>
    </Head>

    <div>
      <Header />

      <main className={styles.container}>
        <h1>Cadastrar categorias</h1>

        <form className={styles.form} onSubmit={handleRegister}>
          <input type="text" placeholder="Digite o nome da categoria" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
          <button className={styles.buttonAdd} type="submit">Cadastrar</button>
        </form>
      </main>
      
    </div>
    
    </>
  )
}

//apenas usuários logados conseguirá utlizar esta página
export const getServerSideProps = canSSRAuth(async (ctx) =>{
  return{
    props:{}
  }
}) 