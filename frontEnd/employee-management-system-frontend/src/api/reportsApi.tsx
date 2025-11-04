import axios from 'axios';
import { API_BASE_URL } from './axiosInstance';

export const reportsApi = {
	getEmployeeReports: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/reports/employees`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	generateReport: async (reportData: any) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/reports/generate`, reportData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	downloadReport: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/Reports/download`, {
				responseType: 'blob'
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
};
