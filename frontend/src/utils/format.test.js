import { describe, expect, it } from 'vitest'
import { dateCourte, dateHeure, dateLongue, tempsRelatif } from './format'

/**
 * Tests unitaires du formatage des dates ISO renvoyées par l'API.
 * Les cas limites (valeur absente) sont vérifiés explicitement : une source
 * jamais récupérée a une date nulle, qui ne doit jamais afficher
 * « Invalid Date » à l'utilisateur.
 */
describe('formatage des dates', () => {
  it('renvoie une chaîne vide quand la date est absente', () => {
    expect(dateCourte(null)).toBe('')
    expect(dateLongue(undefined)).toBe('')
    expect(dateHeure('')).toBe('')
  })

  it('formate une date ISO en jour et mois abrégé', () => {
    const rendu = dateCourte('2026-03-14T10:00:00Z')
    expect(rendu).not.toBe('')
    expect(rendu).toContain('14')
  })

  it('inclut l\'année dans le format long', () => {
    expect(dateLongue('2026-03-14T10:00:00Z')).toContain('2026')
  })
})

describe('temps relatif', () => {
  const ilYA = (ms) => new Date(Date.now() - ms).toISOString()

  it('affiche « jamais » quand aucune date n\'est fournie', () => {
    expect(tempsRelatif(null)).toBe('jamais')
  })

  it('affiche « à l\'instant » pour moins d\'une minute', () => {
    expect(tempsRelatif(ilYA(10 * 1000))).toBe("à l'instant")
  })

  it('affiche les minutes en dessous d\'une heure', () => {
    expect(tempsRelatif(ilYA(30 * 60 * 1000))).toBe('il y a 30 min')
  })

  it('bascule en heures au-delà de soixante minutes', () => {
    expect(tempsRelatif(ilYA(3 * 60 * 60 * 1000))).toBe('il y a 3 h')
  })

  it('bascule en jours au-delà de vingt-quatre heures', () => {
    expect(tempsRelatif(ilYA(2 * 24 * 60 * 60 * 1000))).toBe('il y a 2 j')
  })
})
