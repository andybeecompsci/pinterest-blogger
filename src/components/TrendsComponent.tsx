'use client';

import { useState } from 'react';
import { fetchTrends } from '@/lib/api';

// interface for trend data
interface Trend {
    term: string;
    category: string;
    timestamp: string;
}

// component for displaying pinterest trends
const TrendsComponent = () => {
    // state for trends and loading
    const [trends, setTrends] = useState<Trend[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // handle fetch trends
    const handleFetchTrends = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const trendData = await fetchTrends();
            setTrends(trendData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch trends');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Pinterest Trends</h2>
                <button
                    onClick={handleFetchTrends}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        isLoading 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                >
                    {isLoading ? 'Loading...' : 'Fetch Trends'}
                </button>
            </div>

            <div className="space-y-4">
                {error && (
                    <p className="text-red-400 bg-red-900/20 p-3 rounded-md">
                        {error}
                    </p>
                )}

                {!error && trends.length === 0 && !isLoading && (
                    <p className="text-gray-400">No trends loaded. Click the button to fetch trends.</p>
                )}

                {isLoading && (
                    <p className="text-gray-400">Loading trends...</p>
                )}

                {trends.length > 0 && (
                    <div className="space-y-2">
                        {trends.map((trend, index) => (
                            <div 
                                key={index}
                                className="p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                            >
                                <p className="text-white font-medium">{trend.term}</p>
                                <p className="text-gray-400 text-sm">{trend.category}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendsComponent; 