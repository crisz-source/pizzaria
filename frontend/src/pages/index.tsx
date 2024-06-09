import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import logoImg from '../../public/logo.svg';
import styles from '../../styles/home.module.scss';
import Image from "next/image";
import Input from "../componets/ui/Input";
import Button from "../componets/ui/Button";

import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Dashboard from "./dashboard";


import Link from "next/link";

import { canSSRGuest } from "../utils/canSSRGuest";

import { AuthContext } from "../contexts/AuthContext";



export default function Home() {
  const {signIn} = useContext(AuthContext)
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent ){
    e.preventDefault();

    if(email === '' || password === ''){
      toast.warn('Preencha os dados');
      return;
    }

    //chamando a animação de carregamento
    setLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data); // assim que logar o usuário, a linha de baixo vai ser executada 

    setLoading(false); //finalizadno a animação
  }

 // login 
  return (
    <>
    <Head>
      <title> Sujeito Pizza - faça seu login</title>
    </Head>

    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="logo sujeito pizzaria"/>
      <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input placeholder="Digite seu e-mail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input placeholder="Digite sua senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

            <Button type="submit"
            loading={loading}
            > Acessar</Button>

          </form>

          <Link href={"/cadastro"} className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>
          
      </div> 
    </div>
    </>
  );
}


export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})
