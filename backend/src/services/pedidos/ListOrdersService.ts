import prismaClient from "../../prisma";



class ListOrdersService{
  async execute(){

    const orders = await prismaClient.order.findMany({
      where:{
        darft: false,
        status: false,
      },
      orderBy:{
        created_at: 'desc'
      }
    })

    return orders;

  }
}

export{ListOrdersService}