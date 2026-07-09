import cors from 'cors'; // controla as requisições do frontend para a API
import express from 'express'; // cria o servidor HTTP e as rotas da API
import { AppDataSource } from './data-source';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express(); // representa a API

app.use(express.json()); // permite que o Express entenda JSON no corpo das requisições
app.use(cors());

app.get('/health', (request, response) => { // rota teste para verificar se a API está funcionando, roda o callback toda vez que chegar uma requisição GET /health 
  return response.json({ status: 'ok' });
});

// o errorMiddleware deve ficar depois de todos os middlewares e rotas do express (requisição chega - express.json - cors - rotas - rota/service/controller gerar erro - errorMiddleware)
app.use(errorMiddleware);

const port = Number(process.env.PORT) || 3000; // coloca a porta da API ou 3000 como padrão na constante port

AppDataSource.initialize() // tenta conexão com o MariaDB e se funcionar, segue após o then
  .then(() => {
    console.log('Database connected');

    app.listen(port, () => { // o servidor Express começa a escutar requisições e o callback avisa se o servidor iniciou com sucesso
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
  