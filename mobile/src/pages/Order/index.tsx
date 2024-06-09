import React, {useEffect, useState} from "react";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList} from "react-native";
import {Feather} from '@expo/vector-icons';
import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";

import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { StackParamsList } from "../../routes/app.routes";

type RouteDetailParams = {
    Order: { // pedido talvez
      number: string | number;
      order_id: string;
    }
}

export type CategoryProps = {
 id: string;
 name: string;
}

type ProductProps = {
  id: string;
  name: string;
}

type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>

export default function Order(){
 
    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();


    const [category, setCategory] = useState<CategoryProps[] | []>([])
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false)


    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
    const [modalProductVisible, setModalProductVisible] = useState(false);

    const [amount, setAmount] = useState('1');

    const [items, setItems] = useState<ItemProps[]>([])

    //modal de categorias
    useEffect(() => {
        async function loadInfo(){
          
          const res = await api.get('/listar-categorias')

          setCategory(res.data)
          setCategorySelected(res.data[0])

        }


        loadInfo();
    }, [])


    //modal dos produtos selecionado pela categoria
    useEffect(() => {

        async function loadProducts(){
          const res = await api.get('/categorias/produtos', {
            params: {
              category_id: categorySelected?.id
            }
          })
         
            setProducts(res.data);
            setProductSelected(res.data[0])


        }

        loadProducts();
       

    }, [categorySelected])



async function handleCloseOrder(){
 
  try{

    await api.delete('/deletarPedido', {

      params: {
        order_id: route.params?.order_id
      }

    })

      navigation.goBack();

  }catch(err){
      console.log('deu erro aí amigo: ', err)
  }

}


function handleChangeCategory(item: CategoryProps){

  setCategorySelected(item);
}

function handleChangeProduct(item: ProductProps){
  setProductSelected(item);
}

//adicionando um produto na mesa
async function handleAdd(){
  const res = await api.post('/pedidos/adicionar', {
    order_id: route.params?.order_id,
    product_id: productSelected?.id,
    amount: Number(amount)
  })

  let data = {
    id: res.data.id,
    produc_id: productSelected?.id as string,
    name: productSelected?.name as string,
    amount: amount
  }

  //@ts-ignore
  setItems(oldArray => [...oldArray, data])
  
}

//deletando o item da mesa
async function handleDeleteItem(item_id: string){
  await api.delete('/pedidos/deletar',{
    params:{
      item_id: item_id
    }
  })

  //após remover da api, removemos este item da nossa lista de items
  let removeItem = items.filter(item => {
    return (item.id !== item_id )
  })

  setItems(removeItem)
}

function handleFinsihOrder(){
  navigation.navigate("FinishOrder", {
    number: route.params?.number, 
    order_id: route.params?.order_id})
}

  return(

    <View style={styles.container}>

        <View style={styles.header}>
            <Text style={styles.title}>Mesa {route.params.number} </Text>
          {items.length === 0 && (
              <TouchableOpacity onPress={handleCloseOrder}> 
                  <Feather name="trash-2" size={28} color="#FF3F4B"/>
              </TouchableOpacity>
          )}
    
        </View>

             {/* categoria */}
          {category.length !== 0 && (
            
      <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)}>
          <Text style={{color: '#FFF'}}>{categorySelected?.name}</Text>
      </TouchableOpacity>
          )}

         {/* Produtos */}

        {products.length !== 0 && (
          <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
          <Text style={{color: '#FFF'}}>{productSelected?.name}</Text>
        </TouchableOpacity>
        )}


        <View style={styles.qtdContainer}>
          <Text style={styles.qtdTxt}>Quantidade</Text>
          <TextInput 
          style={[styles.input, {width: '60%', textAlign: 'center'}]}
          placeholderTextColor="#F0F0F0"
          keyboardType="numeric"
         value={amount} onChangeText={(a) => setAmount(a)}
          
          />
        </View>


        <View style={styles.actions}>

        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
          <Text style={styles.btnTxt}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
         style={[styles.btn, { opacity: items.length === 0 ? 0.3 : 1}]}
         disabled={items.length === 0}
          onPress={handleFinsihOrder}>
          <Text style={styles.btnTxt}>Avançar</Text>
        </TouchableOpacity>

        </View>


        <FlatList 
        showsVerticalScrollIndicator={false} 
        style={{flex: 1, marginTop: 24}}
         data={items} 
         keyExtractor={(item) => item.id}
          renderItem={({item}) =>  <ListItem data={item} deleteItem={handleDeleteItem}/>}/>

        {/* modal de categoria */}
        <Modal transparent={true}
        visible={modalCategoryVisible}
        animationType="fade">

          <ModalPicker 
          handleCloseModal={ () => setModalCategoryVisible(false)}
           options={category}
           selectedItem={handleChangeCategory}/>
        </Modal>



        {/* modal de produto */}
        <Modal
         transparent={true}
        visible={modalProductVisible}
        animationType="fade">

          <ModalPicker 
          handleCloseModal={ () => setModalProductVisible(false)}
           options={products}
           selectedItem={handleChangeProduct}/>

        </Modal>


    </View>

  )
}

const styles = StyleSheet.create(
  {
    container:{
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },

    header:{
      flexDirection: 'row',
      marginBottom: 12,
      alignItems: 'center',
      marginTop: 24,
      
    }, 
    
    title:{
      fontSize: 30,
      fontWeight: 'bold',
      color: '#FFF',
      marginRight: 14,

    },

    input:{ 
      backgroundColor: '#101026',
      borderRadius: 4,
      width: '100%',
      height: 40,
      marginBottom: 12,
      justifyContent: 'center',
      paddingHorizontal: 8,
      color: '#FFF',
      fontSize: 20

    },

    qtdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'

    },

    qtdTxt: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
    },

    actions: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },

    btnAdd:{
      backgroundColor: '#3fd1ff',
      borderRadius: 4,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      width: '20%'
    },

    btnTxt:{
      color: '#101026',
      fontSize: 18,
      fontWeight: 'bold',

    },

    btn: {
      backgroundColor: '#3fffa3',
      borderRadius: 4,
      height: 40,
      width: '75%',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
)