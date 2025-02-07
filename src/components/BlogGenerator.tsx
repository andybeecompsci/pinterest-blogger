'use client';

// component for generating blog content
const BlogGenerator = () => {
    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Blog Generator</h2>
            <div className="space-y-4">
                <textarea 
                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter topic or select from trends..."
                    rows={4}
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Generate Blog
                </button>
            </div>
        </div>
    );
};

export default BlogGenerator; 