const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Service for communicating with the Spring Boot backend.
 */
export const apiService = {
  /**
   * Fetch all transactions from the external API.
   */
  async getAllTransactions() {
    try {
      const response = await fetch(`${BASE_URL}/transactions`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Create a new transaction in the external API.
   */
  async createTransaction(transaction) {
    try {
      const response = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error('Failed to create transaction');
      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  /**
   * Delete a transaction by ID.
   */
  async deleteTransaction(id) {
    try {
      const response = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  /**
   * Synchronize local Dexie data with the external API.
   */
  async syncWithBackend(localTransactions) {
    // Implementation for syncing local data to backend
    // This could be expanded based on specific requirements
    console.log('Syncing with backend...', localTransactions);
  }
};
