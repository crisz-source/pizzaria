import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenErrors } from '../services/erros/AuthTokenErrors';

// função para páginas que só podem ser acessadas por usuários que estiverem logados   
export function canSSRAuth<P extends {}>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);  
        const token = cookies['@sujeitopizzaria.token'];

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        try {
            return await fn(ctx);
        } catch (err) {
            if (err instanceof AuthTokenErrors) {
                destroyCookie(ctx, '@sujeitopizzaria.token');
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
            }

            // Para ajudar na depuração de outros erros que não são AuthTokenErrors
            console.error('Erro não esperado ao executar getServerSideProps:', err);
            throw err;
        }
    };
}
