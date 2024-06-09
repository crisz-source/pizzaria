import {Request, Response, response} from 'express';
import {CreateUserService} from '../../services/usuario/CreatUserService';

class CreateUserController{
  async handle(req: Request, res: Response){

    const {name, email, password} = req.body;

    const createUserService = new CreateUserService(); //instanciando o objeto
    const user = await createUserService.execute({
      name,
      email,
      password
    }); //acessando o método execute, que por sua vez está retornando um valor

    return res.json(user)
  }
}

export {CreateUserController}


