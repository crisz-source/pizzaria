import prismaClient from "../../prisma";

//listando os detalhes do pedido
interface DetailRequest{
  order_id: string;
}
class DetailsOrderService{
  async execute({order_id}: DetailRequest){



    const orders = await prismaClient.item.findMany({
      where:{
        order_id: order_id
      },
      include:{
        produto: true,
        pedidos: true,
         
      }
    })

    return orders;



  }
}

export {DetailsOrderService}