import prismaClient from "../../prisma";

//atualizando o rascunho do pedido
interface OrderRequest{
  order_id: string;
}
class SendOrderService{
  async execute({order_id}: OrderRequest){

const order = await prismaClient.order.update({
  where:{
    id:  order_id
  },
  data:{

    darft: false //atualizando o draft para false, pois no banco está como true e assim que for trocado para false, significa que o pedido não é mais um rascunho

  }
})
return order;

  }
}

export {SendOrderService}