export function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f3460] px-6 text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-2xl">
        <div className="text-5xl mb-4">💔</div>
        <h1 className="text-3xl font-bold mb-2">Invitation Expired</h1>
        <p className="text-white/70">The invitation link has expired after 24 hours. Ask the sender for a new invitation to continue.</p>
      </div>
    </div>
  )
}
