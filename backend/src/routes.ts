import {Router} from 'express';
import multer from 'multer';
import {CreateUserController} from './controllers/usuario/CreateUserController'; 
import { LoginUserController } from './controllers/usuario/LoginUserController';
import { DetalhesUsuarioController } from './controllers/usuario/DetalhesUsuarioController';
import { loginAutorizado } from './middlewares/loginAutorizado';

import { CreateOrderController } from './controllers/pedidos/CreateOrderController';
import { RemoveOrderController } from './controllers/pedidos/RemoveOrderController';

import { AddItemController } from './controllers/pedidos/AddItemController';

import { RemoveItemController } from './controllers/pedidos/RemoveItemController';

import { SendOderController } from './controllers/pedidos/SendOderController';

import { ListOrdersController } from './controllers/pedidos/ListOrdersController';

import { DetailsOrderController } from './controllers/pedidos/DetailsOrderController';

import { FinishOrderController } from './controllers/pedidos/FinishOrderController';


import{CreateCategoryController} from './controllers/categorias/CreateCategoryController';
import {ListCategoryController} from './controllers/categorias/ListCategoryController';
import { CreateProductController } from './controllers/produto/CreateProductController';
import { ListByCategoryController } from './controllers/categorias/ListByCategoryController';

import uploadConfig from './config/multer';

const router = Router();

const upload = multer(uploadConfig.upload("./tmp")) // configuração para que as imagens seja salvas neste destido na pasta tmp

//-- ROTAS DE USUÁRIOS --
router.post('/cadastrar', new CreateUserController().handle) //cadastro de usuário
router.post('/entrar', new LoginUserController().handle) //login do usuário

router.get('/usuarioInfo', loginAutorizado, new DetalhesUsuarioController().handle) //pegando informações do usuário que estiver logado em uma determinada página com o middleware = loginAutorizado


// -- ROTAS DE CATEGORIAS --
router.post('/categorias',  loginAutorizado, new CreateCategoryController().handle ) // criar uma nova categoria
router.get('/listar-categorias',  loginAutorizado, new ListCategoryController().handle ) // listando a categoria

// ROTAS DE PRODUTOS
router.post('/produtos', loginAutorizado, upload.single('file'), new CreateProductController().handle)//cadastrando um produto e sua imagem
router.get('/categorias/produtos', loginAutorizado, new ListByCategoryController().handle) // listando produto por categoria

// -- ROTAS DE PEDIDOS -- 
router.post('/pedidos', loginAutorizado, new CreateOrderController().handle) //cadastrando um novo pedido
router.delete('/deletarPedido', loginAutorizado, new RemoveOrderController().handle) // deletando um pedido
router.post('/pedidos/adicionar', loginAutorizado, new AddItemController().handle) //adicionando um pedido
router.delete('/pedidos/deletar', loginAutorizado, new RemoveItemController().handle) // deletando um item
router.put('/pedidos/atualizar', loginAutorizado, new SendOderController().handle) //atualiznado o pedido: rascunho --> /dashboard
router.get('/pedido/todosPedidos', loginAutorizado, new ListOrdersController().handle) //listando os pedidos que ainda não foram concluidos para a cozinha 
router.get('/pedidos/detalhes', loginAutorizado, new DetailsOrderController().handle) // listando os detalhes de um pedido
router.put('/pedidos/finalizar', loginAutorizado, new FinishOrderController().handle) //finalizar o pedido e ir para a cozinha


export {router};