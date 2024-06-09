import { SendOrderService } from "../../services/pedidos/SendOrderService";
import { Request, Response } from "express";

//atualizando o rascunho do pedido
class SendOderController{
  async handle(req: Request, res: Response){

    const {order_id} = req.body;

    const sendOrder = new SendOrderService();

    const order = await sendOrder.execute({
      order_id
    });

    return res.json(order);


  }
}

export {SendOderController}