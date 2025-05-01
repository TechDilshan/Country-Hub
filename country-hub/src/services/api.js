/**
 * REST Countries API Service
 * API Documentation: https://restcountries.com/
 */

const BASE_URL = 'https://restcountries.com/v3.1';

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all countries:", error);
    throw error;
  }
};

// Search countries by name
export const getCountriesByName = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/name/${name}`);
    if (!response.ok) {
      // Return empty array instead of throwing error for better UX
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching countries by name:", error);
    return [];
  }
};

// Filter countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${BASE_URL}/region/${region}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error filtering countries by region:", error);
    throw error;
  }
};

// Get country details by code
export const getCountryByCode = async (code) => {
  try {
    const response = await fetch(`${BASE_URL}/alpha/${code}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching country details:", error);
    throw error;
  }
};

// Search countries by currency
export const getCountriesByCurrency = async (currency) => {
  try {
    const response = await fetch(`${BASE_URL}/currency/${currency}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching countries by currency:", error);
    return [];
  }
};

// Search countries by language
export const getCountriesByLanguage = async (language) => {
  try {
    const response = await fetch(`${BASE_URL}/lang/${language}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching countries by language:", error);
    return [];
  }
};

// Search countries by capital
export const getCountriesByCapital = async (capital) => {
  try {
    const response = await fetch(`${BASE_URL}/capital/${capital}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching countries by capital:", error);
    return [];
  }
}; 