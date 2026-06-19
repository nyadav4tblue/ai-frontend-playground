/**
 * ShareModal
 *
 * Slide-up modal with the shareable URL and a copy-to-clipboard button.
 * Uses Framer Motion for the backdrop fade and panel slide-up.
 * No external clipboard library needed — navigator.clipboard handles it.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Link, X } from 'lucide-react'
import { useState } from 'react'

interface ShareModalProps {
  url:     string
  isOpen:  boolean
  onClose: () => void
}

export function ShareModal({ url, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      // Reset the checkmark after 2s
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select the text in the input
      const el = document.getElementById('share-url-input') as HTMLInputElement
      el?.select()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 glass rounded-t-3xl p-8 max-w-lg mx-auto"
            style={{ bottom: 0 }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="text-2xl">💌</div>
                <h3 className="font-heading text-xl text-white">Share the invitation</h3>
                <p className="text-white/50 text-sm">
                  Send this link to your special someone
                </p>
              </div>

              {/* URL display */}
              <div className="glass-light p-3 flex items-center gap-3">
                <Link size={16} className="text-rose-400 shrink-0" />
                <input
                  id="share-url-input"
                  type="text"
                  readOnly
                  value={url}
                  className="flex-1 bg-transparent text-white/70 text-xs outline-none truncate cursor-text"
                  onClick={e => (e.target as HTMLInputElement).select()}
                />
              </div>

              {/* Copy button */}
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all
                  ${copied
                    ? 'bg-green-500/80 text-white'
                    : 'bg-rose-500/80 hover:bg-rose-500 text-white'
                  }
                `}
              >
                {copied
                  ? <><Check size={16} /> Copied!</>
                  : <><Copy size={16} /> Copy link</>
                }
              </motion.button>

              <p className="text-center text-white/30 text-xs">
                The entire invitation is encoded in the URL — no backend required.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
