import { DetalhesUsuarioService } from "../../services/usuario/DetalhesUsuarioService";
import { Response, Request } from "express";

class DetalhesUsuarioController{
  async handle(req: Request, res: Response){

    const user_id = req.user_id;

    console.log("ID DO USUÁRIO: ", user_id)

    const detalhesUsuarioService = new DetalhesUsuarioService();

    const user = await detalhesUsuarioService.execute(user_id);

    return res.json(user);



  }
}

export { DetalhesUsuarioController}