import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors';
import { router } from './routes';
import cors from 'cors';
import  path  from 'path';

const app = express();
app.use(express.json());
app.use(cors());

// Log de inicialização do servidor
console.log('iniciando o  server...');

// Middleware para rotas
app.use(router);

//expondo a imagem através de uma rota estatica e que vai acessar a pasta tmp que contem as imagens
app.use(
  '/files', express.static(path.resolve(__dirname, '..', 'tmp'))
)

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    // se for uma instancia do tipo Error 
    console.error('Handled error:', err.message); // Log de erro tratado
    return res.status(400).json({
      error: err.message
    });
  }

  console.error('Unhandled error:', err); // Log de erro não tratado
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.'
  });
});

// Verificação de rota não encontrada (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found.'
  });
});

app.listen(3333, () => console.log('Server on!!')); // escolhendo a porta do servidor e mostrando no console que o server está on
