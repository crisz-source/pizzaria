import axios, {AxiosError} from "axios";
import {parseCookies} from 'nookies'
import { AuthTokenErrors } from "./erros/AuthTokenErrors";

import { signOut } from "../contexts/AuthContext";

export function setupAPIClient(ctx = undefined){
    const coockies = parseCookies(ctx);

    const api = axios.create({
      baseURL: 'http://localhost:3333', 
      headers: {
        Authorization: `Bearer ${coockies['@sujeitopizzaria.token']}`
      }
    })

    api.interceptors.response.use(response => {
      return response;
    }, (error: AxiosError) => {
      if(error.response?.status === 401){
        //qualquer erro 401 não autorizado, deve deslogar o usuário

        if(typeof window !== undefined){
          signOut() // chamando a função para deslogar o usuário
        }

        else{
          return Promise.reject(new AuthTokenErrors())
        }
      }

      return Promise.reject(error)


    })

    return api;

}

