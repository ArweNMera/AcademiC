import { create } from 'zustand'
import { authService } from '../services/authService'

const savedToken = localStorage.getItem('optiacademic_token')
const savedUser = localStorage.getItem('optiacademic_user')

const normalizeUser = (data) => {
    if (!data) return null

    // Caso backend devuelve: { user: {...} }
    if (data.user) return data.user

    // Caso backend devuelve directamente: { id, full_name, role, ... }
    return data
}

export const useAuthStore = create((set, get) => ({
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: Boolean(savedToken),
    loading: false,

    login: async (email, password) => {
        set({ loading: true })

        try {
            const data = await authService.login(email, password)

            localStorage.setItem('optiacademic_token', data.access_token)

            set({
                token: data.access_token,
                isAuthenticated: true,
            })

            const meResponse = await authService.getMe()
            const me = normalizeUser(meResponse)

            console.log('USUARIO NORMALIZADO:', me)

            localStorage.setItem('optiacademic_user', JSON.stringify(me))

            set({
                user: me,
                loading: false,
                isAuthenticated: true,
            })

            return me
        } catch (error) {
            set({ loading: false })
            throw error
        }
    },

    loadUser: async () => {
        const { token } = get()

        if (!token) {
            return null
        }

        try {
            const meResponse = await authService.getMe()
            const me = normalizeUser(meResponse)

            localStorage.setItem('optiacademic_user', JSON.stringify(me))

            set({
                user: me,
                isAuthenticated: true,
            })

            return me
        } catch {
            get().logout()
            return null
        }
    },

    logout: () => {
        localStorage.removeItem('optiacademic_token')
        localStorage.removeItem('optiacademic_user')

        set({
            token: null,
            user: null,
            isAuthenticated: false,
            loading: false,
        })
    },
}))