import api from './api'

export const institutionalCspService = {
    diagnoseDomains: async (payload) => {
        const response = await api.post(
            '/csp-diagnostics/institutional/domains',
            payload
        )
        return response.data
    },

    previewInstitutionalSchedule: async (payload) => {
        const response = await api.post('/institutional-csp/preview', payload)
        return response.data
    },

    generateInstitutionalSchedule: async (payload) => {
        const response = await api.post('/institutional-csp/generate', payload)
        return response.data
    },

    generateSelectedInstitutionalSchedule: async (payload) => {
        const response = await api.post(
            '/institutional-csp/generate-selected',
            payload
        )
        return response.data
    },
}