/**
 * useStep — wizard step navigation
 *
 * Keeps the current step index and exposes prev/next helpers.
 * The total step count comes from constants so this hook stays generic.
 */

import { useState } from 'react'
import { STEPS } from '../utils/constants'

export function useStep(initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const totalSteps = STEPS.length

  const next = () => setCurrentStep(s => Math.min(s + 1, totalSteps - 1))
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0))
  const goTo = (step: number) => setCurrentStep(step)

  const isFirst = currentStep === 0
  const isLast  = currentStep === totalSteps - 1

  // Progress as 0–1 for ProgressBar
  const progress = currentStep / (totalSteps - 1)

  return { currentStep, totalSteps, next, prev, goTo, isFirst, isLast, progress }
}
