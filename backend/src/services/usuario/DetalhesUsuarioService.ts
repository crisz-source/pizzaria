import { Prisma } from "@prisma/client";
import prismaClient from "../../prisma";


class DetalhesUsuarioService{
  async execute(user_id){


    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id 
      },
      select:{
        id: true,
        name: true,
        email: true,
      }
    })
    return user;
  }
}

export {DetalhesUsuarioService}