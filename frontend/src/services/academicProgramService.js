import api from '../api/axios'

export const academicProgramService = {
    async getPrograms() {
        const response = await api.get('/academic-programs')
        return response.data
    },
    async createProgram(payload) {
        const response = await api.post('/academic-programs', payload)
        return response.data
    },
    async updateProgram(id, payload) {
        const response = await api.patch(`/academic-programs/${id}`, payload)
        return response.data
    },
    async deleteProgram(id) {
        const response = await api.delete(`/academic-programs/${id}`)
        return response.data
    },
}
