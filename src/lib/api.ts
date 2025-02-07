// api client utilities

// fetch trends from the backend
export const fetchTrends = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/trends');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch trends');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching trends:', error);
        throw error;
    }
}; 