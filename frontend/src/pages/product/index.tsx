import Head from 'next/head';
import styles from './styles.module.scss';
import {canSSRAuth} from '../../utils/canSSRAuth';
import {Header} from '../../componets/Header'
import {FiUpload} from 'react-icons/fi';
import { useState, ChangeEvent, FormEvent } from 'react';
import { setupAPIClient } from '@/src/services/api';
import { NextPageContext } from 'next';
import { toast } from 'react-toastify';


type ItemProps = {
  id: string;
  name: string
}

interface CategoryProps{
  categoryList: ItemProps[];
}


export default function Produto({categoryList}: CategoryProps){
console.log(categoryList)

const [name, setName] = useState('')
const [price, setPrice] = useState('')
const [description, setDescription] = useState('');


  //estado responsável pela preview da imagem
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);

  const [ categories, setCategories] = useState(categoryList || []);
  const [categorieSelected, setCategorieSelected] = useState(0)

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
  
    const img = e.target.files[0];
  
    if (!img) {
      return;
    }
  
    if (img instanceof File) {
      setAvatarUrl(URL.createObjectURL(img)); // Responsável pela preview da imagem
      setImageAvatar(img); // Atualiza o estado com o arquivo selecionado
    }
  }


  

  

  //quando vc selciona uma nova categoria na lista, a função abaixo é selecionada

  //@ts-ignore
  function handleChangeCategory(event){
    //console.log("POSICAO DA CATEGORIA SELECIONADA ", e.target.value)
    //console.log("categoria selecionada", categories[e.target.value])

    setCategorieSelected(event.target.value)

  }


  async function handleRegister(event: FormEvent){
    event.preventDefault();


    try{
      const data = new FormData();

      if(name === '' || price === '' || description === '' || imageAvatar === null){
        toast.error("Preencha todos os dados")
        return;
      }

      data.append('name', name);
      data.append('price', price);
      data.append('description', description);
      data.append('category_id', categories[categorieSelected].id);
      data.append('file', imageAvatar);


      const api = setupAPIClient();

      await api.post('/produtos', data)

      toast.success('Produto cadastrado com sucesso')

    }catch(err){
      console.log(err)
        toast.error('deu erro aí na hora de cadastrar: ' + err)
    }

    setName('');
    setPrice('');
    setDescription('');
    setImageAvatar(null);
    setAvatarUrl('');


  }

  return(
  <>
    <Head>
      <title>Novo produto - Sujeito pizzaria</title>
    </Head>

    <div>
      <Header />

      <main className={styles.container}>
        <h1>Novo produto</h1>

        <form className={styles.form} onSubmit={handleRegister}>
          <label className={styles.labelAvatar}>
          <span> 
            <FiUpload size={25} color="#FFF"/>
          </span>

          <input type="file" accept='image/png, image/jpeg' onChange={handleFile}/>

          
         {avatarUrl && (
           <img className={styles.preview} src={avatarUrl} alt="foto do produto" width={250} height={250} />
         )}
          </label>

          <select value={categorieSelected} onChange={handleChangeCategory}> 
          {categories.map((item, index) => {
                return(
                  <option key={item.id} value={index}>
                    {item.name }

                  </option>
                )
          })}

          </select>

          <input type="text" className={styles.input} placeholder='Digite o nome do produto' value={name} onChange={(e) => setName(e.target.value)}/>
          <input type="text" className={styles.input} placeholder='Preço do produto' value={price} onChange={(e) => setPrice(e.target.value)} />

          <textarea placeholder='Descreva seu produto...' className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)}/>

      <button className={styles.buttonAdd} type='submit'>Cadastrar</button>

        </form>

      </main>
    </div>
    </>
    )
    
  
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  //@ts-ignore
  const apiClient = setupAPIClient(ctx); /// ide está marcando como erro, mas a aplicação está funcionando
  const response = await apiClient.get('/listar-categorias');

  

  //console.log(response.data)
  
  return {
    props: {
      categoryList: response.data
    }
  }
})
