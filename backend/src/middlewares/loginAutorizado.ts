import { Payload } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";


interface PayLoad{
  sub: string;
}

export function loginAutorizado(req: Request, res: Response, next: NextFunction){
   
 //receber o token

 const authToken = req.headers.authorization;

 if(!authToken){
  return res.status(401).end();

 }

 const [, token] = authToken.split(" ")

 //console.log(token)

 try{

//validação do token
const {sub} = verify(token, process.env.JWT_SECRET) as PayLoad;

//recuperar o id do token e colocar dentro de uma varíavel user_id dentro do req
req.user_id = sub;

//console.log(sub); //pegando o id do usuário que estiver logado, descriptografando

return next(); 



 }catch(err) {
  return res.status(401).end();
 }

}