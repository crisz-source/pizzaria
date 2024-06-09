import { canSSRAuth } from "@/src/utils/canSSRAuth";
import Head from "next/head";
import {Header} from '../../componets/Header';
import styles from './styles.module.scss';
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "@/src/services/api";
import { useState } from "react";
import Modal from 'react-modal';
import { ModalOrder } from "@/src/componets/ModalOrder";


type OrderProps= {
  id: string;
  table: string | number;
  status: boolean;
  darft: boolean;
  name: string | null;

}

interface HomeProps{
  orders: OrderProps[];
}

export type OrderItemProps ={
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  produto: { //produto
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  }

  pedidos: { //pedidos

    id: string;
    table: string | number;
    status: boolean;
    name: string | null;


  }
}


export default function Dashboard({orders}: HomeProps){

  const [orderList, setOrderList] = useState(orders || [])

  const [modalItem, setModalItem] = useState<OrderItemProps[]>()
  const[modalVisivel, setModalVisivel] = useState(false);

  function handleCloseModal(){
    setModalVisivel(false)
  }

  async function handleOpenModalView(id: string){
    //alert('ID CLICADO: ' + id)

    const api = setupAPIClient();

    const res = await api.get('/pedidos/detalhes', {
      params:{
        order_id: id,
      }
    })

    setModalItem(res.data)
    setModalVisivel(true);

  }

  //concluindo o pedido (verificar a possibilidade de chegar uma notificação no projeto app informando que o pedido foi concluido)
  async function handleFinishItem(id: string){

  const api = setupAPIClient();
  await api.put('/pedidos/finalizar', {order_id: id,})

  const response = await api.get('/pedido/todosPedidos');

  setOrderList(response.data) //pegando a lista de pedidos atualizadas assim que é concluído
  setModalVisivel(false); 


  }

  async function handleRefreshOrders(){
    const api = setupAPIClient();
    const res = await api.get('/pedido/todosPedidos')
    setOrderList(res.data)
  }

  Modal.setAppElement('#__next')
  return(
   <>
    <Head> 
      <title> Painel - sujeito pizzaria</title>
    </Head>

    <div>
    <Header />
      <main className={styles.container}>
        <div className={styles.containerHeader}>

            <h1>Últimos pedidos</h1>
            <button onClick={handleRefreshOrders}>
              <FiRefreshCcw size={25} color="#3fffa3" />
            </button>
          </div>

          <article className={styles.listaDePedidos}>

              {orderList.length === 0 && (
                <span className={styles.nenhumPedido}>Nenhum pedido por enquanto...</span>
              ) }

            {orderList.map(item => (
                   <section key={item.id} className={styles.pedidoItem}>
                          <button onClick={() => handleOpenModalView(item.id)}>
                            <div className={styles.tag}></div> 
                            <span>Mesa {item.table} </span>
                          </button>
                 </section>

            ))}

          </article>
       



      </main>

      
      {modalVisivel && ( //quando clicado em algum pedido, o modal vai ficar true e se for true vai redenrizar o componente ModalOrder
      //@ts-ignore
        <ModalOrder isOpen={modalVisivel} onRequestClose={handleCloseModal} order={modalItem} handleFinishOrder={handleFinishItem} />
      )}

    </div>



   </>
  )

}


export const getServerSideProps = canSSRAuth(async (ctx) => {

//@ts-ignore
  const api = setupAPIClient(ctx);

  const response = await api.get('/pedido/todosPedidos')

 // console.log(response.data)
  return {
    props: {
      orders: response.data
    }
  }
})