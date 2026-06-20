import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
          <div className="space-y-6">
            <div className="text-5xl font-bold tracking-tight">Relationship Flow Builder ❤️</div>
            <p className="max-w-2xl text-white/70 text-lg leading-relaxed">
              Create beautiful, animated questionnaire experiences for your partner.
              Build the questions, share one link, and let them respond one step at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400 transition"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Design the questions',
              description: 'Add any question type — radio, date, text, select, multi-choice. Nothing is hardcoded.',
            },
            {
              title: 'Share one link',
              description: 'Publish a unique link your partner opens on any device. No account needed on their end.',
            },
            {
              title: 'View responses',
              description: 'See every answer they submitted in a clean, readable dashboard.',
            },
          ].map(card => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              <h2 className="font-semibold text-white mb-2">{card.title}</h2>
              <p>{card.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
