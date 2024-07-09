// services/api.js
import axios from 'axios';

const API_URL = 'https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/activateappuser.php?activationcode='; // Replace with your actual API endpoint

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export { registerUser };
