import api from '../api/axios'

export const facultyService = {
    async getFaculties() {
        const response = await api.get('/faculties')
        return response.data
    },
    async createFaculty(payload) {
        const response = await api.post('/faculties', payload)
        return response.data
    },
    async updateFaculty(id, payload) {
        const response = await api.patch(`/faculties/${id}`, payload)
        return response.data
    },
    async deleteFaculty(id) {
        const response = await api.delete(`/faculties/${id}`)
        return response.data
    },
}
