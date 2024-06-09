import {useState, FormEvent, useContext} from 'react';

import Head from "next/head";
import logoImg from '../../../public/logo.svg';
import styles from '../../../styles/home.module.scss';
import Image from "next/image";
import Input from "../../componets/ui/Input";
import Button from "../../componets/ui/Button";
import { toast } from 'react-toastify';

import { AuthContext } from '@/src/contexts/AuthContext';

import { FaSpinner } from "react-icons/fa";

import Link from "next/link";

export default function Cadastro() {

  const {signUp} = useContext(AuthContext)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false); 


      async function handleCadastrar(event: FormEvent){
        event.preventDefault();

        if(name === '' || email === '' || password === '') {
         toast.warn('Preencha os campos')

          return;
        }

        setLoading(true);

        let data ={
          name,
          email,
          password
        }

        await signUp(data);
        setLoading(false);

      }

  return (
    <>
    <Head>
      <title> Faça seu cadastro agora!</title>
    </Head>

    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="logo sujeito pizzaria"/>
      <div className={styles.login}>

        <h1>Criando sua conta</h1>

          <form onSubmit={handleCadastrar}>
            <Input placeholder="Digite seu nome" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Digite seu e-mail" type="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input placeholder="Digite sua senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

            <Button type="submit"
            loading={loading}
            > Cadastrar</Button>

          </form>

          <Link href={"/"} className={styles.text}>
         Já possui uma conta? Faça o login!

          </Link>
          
      </div> 
    </div>
    </>
  );
}
