import axios from 'axios'

const httpRequest = axios.create({
  timeout: 180000,
  baseURL: process.env.REACT_APP_API_URL,
})

// Add a request interceptor
httpRequest.interceptors.request.use(
  (config) => {
    // add request token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer') ? token : `Bearer ${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error).then()
  },
)

export default httpRequest
