import api from '../api/axios'

export const curriculumService = {
    async getPlans() {
        const response = await api.get('/curriculum-plans')
        return response.data
    },
    async getPlan(id) {
        const response = await api.get(`/curriculum-plans/${id}`)
        return response.data
    },
    async createPlan(payload) {
        const response = await api.post('/curriculum-plans', payload)
        return response.data
    },
    async updatePlan(id, payload) {
        const response = await api.patch(`/curriculum-plans/${id}`, payload)
        return response.data
    },
    async deletePlan(id) {
        const response = await api.delete(`/curriculum-plans/${id}`)
        return response.data
    },
    async updateCurriculumCourse(id, payload) {
        const response = await api.patch(`/curriculum-courses/${id}`, payload)
        return response.data
    },
    async createPrerequisite(payload) {
        const response = await api.post('/course-prerequisites', payload)
        return response.data
    },
    async deletePrerequisite(id) {
        const response = await api.delete(`/course-prerequisites/${id}`)
        return response.data
    },
    async updateElective(id, payload) {
        const response = await api.patch(`/elective-bank-courses/${id}`, payload)
        return response.data
    },
    async createElective(payload) {
        const response = await api.post('/elective-bank-courses', payload)
        return response.data
    },
    async deleteElective(id) {
        const response = await api.delete(`/elective-bank-courses/${id}`)
        return response.data
    },
    async getMyCurriculum() {
        const response = await api.get('/students/me/curriculum')
        return response.data
    },
    async getMyEligibleCourses() {
        const response = await api.get('/students/me/eligible-courses')
        return response.data
    },
}
