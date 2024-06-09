import prismaClient from '../../prisma/index';
import {hash} from 'bcryptjs'; //biblioteca para criptografar uma senha

interface UserRequest{
  name: string;
  email: string;
  password: string;
} 



class CreateUserService{
  async execute({name, email, password}: UserRequest){

      //verificação se o usuário enviou um e-mail
      if(!email){
        throw new Error("Email incorreto")
      }

       //verificação se o e-mail que o usuário digitou já está cadastrado
       const usuarioJaCadastrado = await prismaClient.user.findFirst({
        where:{
          email: email
        }
       })

       if(usuarioJaCadastrado){
        throw new Error("Usuário já cadastrado")
       }


       //criptogrando a senha
       const passwordSecurity = await hash(password, 8)

       //cadastrando um usuario no banco de dados
       const user = await prismaClient.user.create({ 
        data:{
          name: name,
          email: email,
          password: passwordSecurity //senha sendo salva no banco de dados já criptografado
        },
        //retornando para o usuário apenas o id, nome e e-mail
        select:{
          id: true,
          name: true,
          email: true,

        }
       })


    return user;
  }
}

export {CreateUserService};