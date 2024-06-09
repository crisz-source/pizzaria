import React, {useContext } from 'react'
import { View, ActivityIndicator} from 'react-native'
import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'
import { AuthContext } from '../contexts/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'


export function Routes(){
  const {isAuthenticated, loading} = useContext(AuthContext)


  if(loading){
    return(
      <View style={{flex: 1, backgroundColor: '#f5f7fb', justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={60} color="#1D1D2E"/>
      </View>
    )
  }

 

  return(
      //condição, se o usuário estiver logado vai mostrar o componente <AppRoutes /> se não, vai mostrar o <AuthRoutes />
    isAuthenticated ? <AppRoutes /> : <AuthRoutes />

  )
}

