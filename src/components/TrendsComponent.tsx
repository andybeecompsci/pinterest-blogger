'use client';

// component for displaying pinterest trends
const TrendsComponent = () => {
    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Pinterest Trends</h2>
            <div className="space-y-4">
                {/* placeholder for trends data */}
                <p className="text-gray-400">Loading trends...</p>
            </div>
        </div>
    );
};

export default TrendsComponent; 