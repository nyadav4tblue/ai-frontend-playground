/**
 * TestPage
 * 
 * Very simple test page to check if routing works
 */

export function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-xl">If you can see this, routing is working!</p>
        <p className="mt-4 text-rose-300">Login page should be visible now.</p>
      </div>
    </div>
  )
}