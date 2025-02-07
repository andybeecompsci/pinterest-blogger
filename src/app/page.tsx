import TrendsComponent from '@/components/TrendsComponent';
import BlogGenerator from '@/components/BlogGenerator';
import PinGenerator from '@/components/PinGenerator';

// main page component
export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">PinMaker</h1>
          <p className="text-gray-400">Create engaging Pinterest content with AI</p>
        </header>

        {/* main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <TrendsComponent />
          </div>
          <div className="col-span-1">
            <BlogGenerator />
          </div>
          <div className="col-span-1">
            <PinGenerator />
          </div>
        </div>
      </div>
    </main>
  );
}
