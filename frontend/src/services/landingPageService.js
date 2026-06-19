import api from './api';

export const landingPageService = {
    getLandingPageData: async () => {
        const response = await api.get('/public/landing-page');
        return response.data;
    },

    updateLandingPageData: async (formData) => {
        const response = await api.post('/landing-page', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
