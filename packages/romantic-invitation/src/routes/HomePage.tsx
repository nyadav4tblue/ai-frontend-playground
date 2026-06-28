import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnhancedFloatingHearts } from '../components/EnhancedFloatingHearts'
import { RomanticBackground } from '../components/RomanticBackground'
import { Heart, Sparkles, MessageCircle, Share2, Eye } from 'lucide-react'

export function HomePage() {
  return (
    <main className="min-h-screen text-white px-6 pb-12 pt-28 sm:pt-32 relative overflow-hidden">
      {/* Enhanced background elements */}
      <RomanticBackground />
      <EnhancedFloatingHearts intensity="romantic" />
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Hero section with enhanced glass effect */}
        <section className="glass-strong p-8 sm:p-12 mb-16">
          <div className="space-y-8 max-w-3xl mx-auto text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-rose-400 animate-pulse" />
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-heading">
                  <span className="text-gradient-romantic">Relationship</span>{' '}
                  <span className="text-white">Flow Builder</span>
                </h1>
                <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-heartbeat" />
              </div>
              
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                Create <span className="text-rose-300 font-semibold">beautiful, animated questionnaire experiences</span> for your partner.
                Build the questions, share one link, and let them respond one step at a time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/signup"
                className="btn-romantic text-lg px-8 py-4 flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Get started free
                <span className="animate-glow">✨</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
                Sign in
              </Link>
            </div>
            
            {/* Romantic tagline */}
            <div className="pt-8">
              <p className="text-white/60 text-sm uppercase tracking-widest">
                Where love meets technology • Create unforgettable moments
              </p>
            </div>
          </div>
        </section>

        {/* Feature cards with enhanced design */}
        <section className="grid gap-8 md:grid-cols-3 mb-16">
          {[
            {
              title: 'Design the questions',
              description: 'Add any question type — radio, date, text, select, multi-choice. Nothing is hardcoded.',
              icon: <MessageCircle className="w-8 h-8 text-rose-400" />,
              gradient: 'from-rose-500/10 to-rose-600/5'
            },
            {
              title: 'Share one link',
              description: 'Publish a unique link your partner opens on any device. No account needed on their end.',
              icon: <Share2 className="w-8 h-8 text-romantic-coral" />,
              gradient: 'from-romantic-coral/10 to-romantic-coral/5'
            },
            {
              title: 'View responses',
              description: 'See every answer they submitted in a clean, readable dashboard.',
              icon: <Eye className="w-8 h-8 text-romantic-lavender" />,
              gradient: 'from-romantic-lavender/10 to-romantic-lavender/5'
            },
          ].map((card, index) => (
            <motion.div 
              key={card.title}
              className="glass p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:border-white/20 transition-colors">
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-heading">{card.title}</h2>
                  <p className="text-white/70 leading-relaxed">{card.description}</p>
                </div>
                
                <div className="pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
                  <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                    Create romantic moments →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Romantic call to action */}
        <section className="glass border-gradient-romantic p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 font-heading">
              Ready to create something <span className="text-gradient-romantic">special</span>?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of couples who've created meaningful moments with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-romantic px-10 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-6 h-6" />
                Start your journey free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white/20 bg-transparent px-10 py-4 text-lg font-semibold text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300"
              >
                See examples
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/50">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
