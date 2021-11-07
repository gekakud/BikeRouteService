import axios from 'axios'

const apiUrlDev = "http://localhost:6001";
const apiUrlProd = "https://bikeroutewin.azurewebsites.net";
const routesApi = `${apiUrlDev}/api/Routes/`;

const instance = axios.create({
  baseURL: routesApi,
  timeout: 0,
})

export  { instance }