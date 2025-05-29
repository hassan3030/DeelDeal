export default function Loading() {
return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafbfc]">
    <div className="w-80 p-6 rounded-xl bg-white shadow-md">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 rounded-full bg-gray-200 mr-4 animate-pulse" />
        <div>
          <div className="w-30 h-4 bg-gray-200 rounded-lg mb-2 animate-pulse" />
          <div className="w-20 h-3 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-md mb-2.5 animate-pulse" />
      <div className="w-[90%] h-3 bg-gray-200 rounded-md mb-2.5 animate-pulse" />
      <div className="w-[80%] h-3 bg-gray-200 rounded-md mb-2.5 animate-pulse" />
      <div className="w-[60%] h-3 bg-gray-200 rounded-md animate-pulse" />
    </div>
    <p className="mt-8 text-lg text-gray-400">Loading About Page...</p>
  </div>
);
}