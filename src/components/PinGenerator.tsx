'use client';

// component for generating pinterest pins
const PinGenerator = () => {
    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Pin Generator</h2>
            <div className="space-y-4">
                <div className="aspect-[2/3] bg-gray-700 rounded-md flex items-center justify-center border border-gray-600">
                    <p className="text-gray-400">Pin Preview</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Generate Pin
                </button>
            </div>
        </div>
    );
};

export default PinGenerator; 