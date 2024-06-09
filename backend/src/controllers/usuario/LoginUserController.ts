import { Request, Response } from "express";
import { LoginUserService } from "../../services/usuario/LoginUserService";

class LoginUserController{

async handle(req: Request, res: Response){
  const {email, password} = req.body;

  const loginUserService = new LoginUserService();

  const login = await loginUserService.execute({
    email,
    password
  });

  return res.json(login)
}

}

export {LoginUserController};