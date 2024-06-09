import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';  
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { api } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { StackParamsList } from '../../routes/app.routes';

type RouteDetailParams ={
  FinishOrder:{
    number: string | number;
    order_id: string;
  }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export default function FinishOrder(){
  const route = useRoute<FinishOrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  async function handleFinish(){

    try{

      await api.put('/pedidos/atualizar', {
        order_id: route.params?.order_id
      })

      navigation.popToTop(); //voltando para a primeira tela



    }catch(err){
      console.log("ERRO AO FINALIZAR, TENTE MAIS TARDE ", err)
    }

  }


  return(
    <View style={styles.container}>
      <Text style={styles.alert}>Você deseja finalizar este pedido?</Text>
      <Text style={styles.title}>Mesa {route.params?.number}</Text>

      <TouchableOpacity style={styles.btn} onPress={handleFinish}> 
        <Text style={styles.txtBtn}>Finalizar pedido</Text>
        <Feather name= "shopping-cart" size={20} color="#1d1d2e"/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#1d1d2e',
    paddingVertical: '5%',
    paddingHorizontal: '4%',
    alignItems: 'center',
    justifyContent: 'center',

  },

  alert:{
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
     marginBottom: 12,

  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },

  btn:{
    backgroundColor: '#3fffa3',
    flexDirection: 'row',
    width: '65%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,

  },
  txtBtn:{
    fontSize: 18,
    marginRight: 8,
    fontWeight: 'bold',
    color: '#1d1d2e'
  }
  
})