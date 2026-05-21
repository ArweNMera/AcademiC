import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
})

api.interceptors.request.use(
    (config) => {
        const authStorage = localStorage.getItem('auth-storage')

        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage)

                const token =
                    parsed?.state?.token ||
                    parsed?.state?.accessToken ||
                    parsed?.state?.user?.token ||
                    parsed?.token ||
                    parsed?.accessToken

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            } catch {
                // Si localStorage no tiene formato válido, no rompe la app
            }
        }

        return config
    },
    (error) => Promise.reject(error)
)

export default api