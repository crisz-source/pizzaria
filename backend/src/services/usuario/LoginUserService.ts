import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import {sign} from 'jsonwebtoken';


//caso de usario se o usuário errar a senha ou o e-mail
interface LoginRequest{
  email: string;
  password: string;
}

class LoginUserService{
  async execute({email, password}: LoginRequest){

    //verificação se o e-mail já existe.
    const user = await prismaClient.user.findFirst({
      where:{
        email: email
      }
    })

    if(!user){
      throw new Error("E-mail ou senha incorreto.")
    }

    //verificação se a senha que o usuário digitou está correto
    const senhaIgualJaCadastrada = await compare(password, user.password) //comparando se a senha digitada pelo usuário é igual a senha criptografada que está cadastrado no banco

    if(!senhaIgualJaCadastrada){
      throw new Error("E-mail ou senha incorreto.")
    }

    //se deu tudo certo, será gerado um token para o usuário.
    const token = sign(
      {
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '60d' //a cada 60 dias o token será expirado e o usuário tem que gerar um novo token, criar outra conta
      }
    )
     

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    }
  }
}

export { LoginUserService }