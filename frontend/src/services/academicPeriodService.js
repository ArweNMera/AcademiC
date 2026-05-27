import api from '../api/axios'

export const academicPeriodService = {
    async getPeriods() {
        const response = await api.get('/academic-periods')
        return response.data
    },
    async createPeriod(payload) {
        const response = await api.post('/academic-periods', payload)
        return response.data
    },
    async updatePeriod(id, payload) {
        const response = await api.patch(`/academic-periods/${id}`, payload)
        return response.data
    },
    async deletePeriod(id) {
        const response = await api.delete(`/academic-periods/${id}`)
        return response.data
    },
}
