import axios from 'axios'

let config = {
    baseURL: "http://127.0.0.1:8888/api/private/v1/",
    timeout: 10000
  };
  
  const _axios = axios.create(config);

  //请求拦截
  _axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
    }, err => {
        console.log(err)
    }
  )
  export const request = _axios;
  