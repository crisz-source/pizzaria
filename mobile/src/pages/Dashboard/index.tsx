import React, {useState} from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet} from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { StackParamsList } from '../../routes/app.routes'
 import { NativeStackNavigationProp } from '@react-navigation/native-stack'
 import { api } from '../../services/api'

export default function  Dashboard(){
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [number, setNumber] = useState('')


 async function abrirMesa(){
  if(number === ''){
    return;
  }

  const res = await api.post('/pedidos', {
    table: Number(number)
  })

  //console.log(res.data)

  //fazer requisição e abrir a mesa e navegar para a próxima tela
  navigation.navigate('Order', {number: number, order_id: res.data.id})
  setNumber('');





 }


  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Novo pedido</Text>
      <TextInput 
      placeholder='Número da mesa' 
      placeholderTextColor='#f0f0f0' 
      style={styles.input} 
      keyboardType='numeric'
      value={number}
      onChangeText={(n) => setNumber(n)}
      
      />

      <TouchableOpacity style={styles.btn} onPress={abrirMesa}>
        <Text style={styles.btnTxt}>Abrir mesa</Text>
        

        </TouchableOpacity>


     
    </SafeAreaView>
     
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#1d1d2e',
  },

  title:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,

  },

  input: {
    width: '90%',
    height: 60,
    backgroundColor: '#101026',
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 22,
    color: '#FFF',


  },

  btn: {
    width: '90%',
    height: 40,
    backgroundColor: '#3fffa3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btnTxt:{
    fontSize: 18,
    color: '#101026',
    fontWeight: 'bold'

  }



})