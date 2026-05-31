import api from '../api/axios'

export const campusService = {
    async getCampuses() {
        const response = await api.get('/campuses')
        return response.data
    },
    async createCampus(payload) {
        const response = await api.post('/campuses', payload)
        return response.data
    },
    async updateCampus(id, payload) {
        const response = await api.patch(`/campuses/${id}`, payload)
        return response.data
    },
    async deleteCampus(id) {
        const response = await api.delete(`/campuses/${id}`)
        return response.data
    },
}
