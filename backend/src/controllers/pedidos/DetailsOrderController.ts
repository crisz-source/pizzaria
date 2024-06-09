import { Request, Response } from "express";

import { DetailsOrderService } from "../../services/pedidos/DetailsOrderService";

//listando os detalhes do pedido
class DetailsOrderController{


  async handle(req: Request, res: Response){
    
    const order_id = req.query.order_id as string;

    const detailOrderService = new DetailsOrderService();

    const orders = await detailOrderService.execute({
      order_id
    })

    return res.json(orders);
   
  }
}

export { DetailsOrderController};