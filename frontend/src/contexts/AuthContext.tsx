import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies} from "nookies";
import Router from "next/router";
import { toast } from "react-toastify";
import { api } from "../services/apiClient";

type AuthContextData = {
  user: UserProps | undefined; // Allow for undefined since user might be null initially
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  name: string;
  email: string;
  password: string;
}



type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try{

    destroyCookie(undefined, '@sujeitopizzaria.token') //destruindo o token

    Router.push('/')

  }

  catch{
    console.log("Erro ao deslogar")

  }
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const isAuthenticated = !!user;


 useEffect(() => {

  //tentar pegar algo no cookie

  const {'@sujeitopizzaria.token': token} = parseCookies();
  if(token){
    api.get('/usuarioInfo').then(response => {
      const {id, name, email} = response.data;

      setUser({
        id,
        name,
        email
      })
    }).catch(() => {
      //deslogar usuáruio.
      signOut();
    })
  }


 }, [])


  //login
  async function signIn({email, password}: SignInProps){

      try{
          const response = await api.post('/entrar',{
            email,
            password
          })

          //console.log(response.data)

          const {id, name, token} = response.data

          setCookie(undefined, '@sujeitopizzaria.token', token, {
            // 60 segundos por minuto
            // 60 minutos por hora
            // 24 horas por dia
            // 30 dias por mês (aproximadamente)
            // o token vai expirar em 2 mes
            maxAge: 60 * 60 * 24 * 30 * 2,
            path: "/" //quais caminhos terao acesso ao coockie (se está deixando apenas uma barra '/' significa todos)
          })

          setUser({
            id, name, email,
          })

          //passar para próximas requisições na api com o token
          api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')

          //se tudo ocorrer corrtamente, o usuário será direcionado para página de Dashboard
          Router.push('/dashboard');

          
      }
      catch(err){
       toast.error('Erro ao acessar.')
      }
    


  }

 //cadastro 
  async function signUp({name, email, password}: SignUpProps){

   try{
    //cadastrar um usuario pela rota informada
     const response = await api.post('/cadastrar', {
      name,
      email,
      password
     })

     toast.success('Conta criada com sucesso!')

     Router.push('/')

   }

   catch(err){

    toast.error('Erro ao cadastrar.')

   }



  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
