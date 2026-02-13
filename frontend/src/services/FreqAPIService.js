/**
 * FREQ API Service
 * Handles communication with the FREQ AI backend
 */

export class FreqAPIService {
  constructor(baseURL = '/api/v1') {
    this.baseURL = baseURL;
  }

  async getSystemState() {
    try {
      const response = await fetch(`${this.baseURL}/state`);
      if (!response.ok) {
        throw new Error('Failed to fetch system state');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Return mock data for scaffold
      return {
        status: 'ready',
        start_time: new Date().toISOString(),
        cycles_completed: 0,
      };
    }
  }

  async startDraftingCycle(rgbdData) {
    try {
      const response = await fetch(`${this.baseURL}/cycle/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rgbdData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start drafting cycle');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getHealthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'unhealthy' };
    }
  }
}
