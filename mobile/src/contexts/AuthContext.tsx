import React, {useState, createContext, ReactNode, useEffect} from 'react';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  login: (info: LoginProps) => Promise<void>
  loadingAuth: boolean;
  loading: boolean;
  deslogar: () => Promise<void>;
}

type UserProps = {
  id: string; 
  name: string;
  email: string;
  token: string;
}

type AuthProviderProps ={
  children: ReactNode;
}

type LoginProps ={ 
  email: string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps){
  const [user, setUser] = useState<UserProps>({

    id: '',
    name: '',
    email: '',
    token: ''
  })

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user.name;


  //mantendo o usuário logado
  useEffect(() => {
    async function getUser(){
      //pegar os dados salvos dos usuarios

      const userInfo = await AsyncStorage.getItem('@sujeitopizzaria');

      let hasUser: UserProps = JSON.parse(userInfo || '{}')

      //verificar se recebe as informações do usuário e mantendo logado
      if(Object.keys(hasUser).length > 0 ){
          api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`

          setUser({
            id: hasUser.id,
            name: hasUser.name,
            email: hasUser.email,
            token: hasUser.token
          })

      }

      setLoading(false);

    }

    getUser();
  }, [])



  //fazendo o login do usuário
  async function login({email, password}: LoginProps){
    setLoadingAuth(true);

    //fazendo requisção na api e verificando se realmente deu certo com o console.log
    try{

      const res = await api.post('/entrar', {
        email, 
        password
      })

      //console.log(res.data)
      const { id, name, token } = res.data;

      const data = {
         ...res.data
      }

      //salvando o token em storage para que o usuário não precise realizar o login novamente
      await AsyncStorage.setItem('@sujeitopizzaria',JSON.stringify(data) )

      //todas as requisições precisa de um token para poder seguir, sendo assim a linha debaixo informa por padrão este token para todas as rotas
       api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser({
        id, 
        name,
        email,
        token
      })

      setLoadingAuth(false)
      
    }catch(err){
      console.log('erro ao acessar', err)
      setLoadingAuth(false);
    }

  }


  //fazendo o logout do usuário
  async function deslogar(){
    await AsyncStorage.clear().then(() => {
      setUser({
        id: '',
        name: '',
        email: '',
        token:'',
      })
    })
  }

  return(
    <AuthContext.Provider value={{
      isAuthenticated, 
      user, 
      login, 
      loading, 
      loadingAuth,
      deslogar,
      }}>
       {/* todas as páginas ficaram aqui */}

      {children}
    </AuthContext.Provider>
  )
}
