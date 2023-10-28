import axios, { AxiosRequestConfig } from 'axios'

export default async function fetchData<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await axios.request(config)
    return response.data;
}
