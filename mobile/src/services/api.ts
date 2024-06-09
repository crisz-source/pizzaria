import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3333'
  baseURL: 'http://172.23.254.173:3333' //mudar o ip caso esteja em pbh
 // baseURL: 'http://192.168.4.10:3333' // mudar o ip caso esteja em casa
})

export {api};

