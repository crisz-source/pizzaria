import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from 'next';
import { parseCookies } from 'nookies';

//função para páginas que só podem ser acessadas por visitantes, usuários que não estão logados

export function canSSRGuest<P extends {}>(fn: GetServerSideProps<P>) {
  
  
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {


      const coockies = parseCookies(ctx); 
      
      if(coockies['@sujeitopizzaria.token']){
        return{
          redirect: {
            destination: '/dashboard', // --->  [/pedidos/atualizar]
             permanent: false,
          }
        }
      }
      
      // Se o cara tentar acessar a página porém tendo já um login salvo rediricionamos
      return await fn(ctx);

    }


}