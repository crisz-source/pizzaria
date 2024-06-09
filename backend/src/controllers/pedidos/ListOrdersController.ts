import { Response, Request } from "express";
import { ListOrdersService } from "../../services/pedidos/ListOrdersService";

class ListOrdersController{
  async handle(req: Request, res: Response){

    const listOrderService = new ListOrdersService();

    const orders = await listOrderService.execute();

    return res.json(orders);



  }
}

export { ListOrdersController}