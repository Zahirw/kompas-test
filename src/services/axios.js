import axios from 'axios'
// import { useStore } from '../../store'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// apiClient.interceptors.request.use(
//   request => {
//     const store = useStore()
//     request.headers.Authorization = `Bearer ${store.user.jwt}`;
//     request.headers.Accept = "application/json";
//     return request
//   },
//   error => {
//     return Promise.reject(error)
//   },
// )

export default apiClient