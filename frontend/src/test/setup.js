// Configuration commune à tous les tests frontend.
// - jest-dom ajoute les matchers DOM (toBeInTheDocument, toBeDisabled…)
// - cleanup démonte les composants montés entre chaque test, pour éviter
//   qu'un rendu précédent ne pollue les requêtes du suivant.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
})
