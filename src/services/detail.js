import apiClient from './axios'

export const detailList = () => {
  return apiClient({
    method: 'get',
    url: '/detail',
  })
}

export const addDetail = (data) => {
  return apiClient({
    method: 'post',
    url: '/detail',
    data
  })
}