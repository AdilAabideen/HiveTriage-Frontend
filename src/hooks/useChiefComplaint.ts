/**
 * Hook for managing chief complaint flow (categories, presentations, timings, text)
 */

import { useState, useEffect, useCallback } from 'react'
import {
  ChiefComplaintCategory,
  CategorySelectionItem,
  ChiefComplaintPresentation,
  ChiefComplaintPresentationsResponse,
  PresentationTiming,
  OnsetBucket,
  Trend,
  ChiefComplaintSelectedCategory,
  ChiefComplaintSelectedPresentation,
} from '../types'
import { questionService } from '../services/questionService'

export type ChiefComplaintPhase =
  | 'loading_categories'
  | 'categories'
  | 'loading_presentations'
  | 'presentations'
  | 'timings'
  | 'text_entry'
  | 'submitting'
  | 'complete'

export function useChiefComplaint(encounterId: string | null, shouldStart: boolean) {
  const [phase, setPhase] = useState<ChiefComplaintPhase>('loading_categories')
  const [categories, setCategories] = useState<ChiefComplaintCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<CategorySelectionItem[]>([])
  const [presentations, setPresentations] = useState<ChiefComplaintPresentation[]>([])
  const [selectedPresentationsByCategory, setSelectedPresentationsByCategory] = useState<Record<string, string[]>>({})
  const [currentPresentationGroupIndex, setCurrentPresentationGroupIndex] = useState(0)
  const [presentationTimingById, setPresentationTimingById] = useState<Record<string, PresentationTiming>>({})
  const [chiefComplaintText, setChiefComplaintText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch categories when started
  useEffect(() => {
    if (!shouldStart || !encounterId) return
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const data: ChiefComplaintCategory[] = await questionService.getChiefComplaintCategories(encounterId)
        setCategories(data)
        setPhase('categories')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [shouldStart, encounterId])

  // Fetch presentations when category selection is complete
  useEffect(() => {
    if (phase !== 'loading_presentations' || selectedCategories.length === 0) return
    
    const fetchPresentations = async () => {
      try {
        setIsLoading(true)
        const response: ChiefComplaintPresentationsResponse = await questionService.getChiefComplaintPresentations(
          { categories: selectedCategories }
        )
        setPresentations(response.presentations)
        setCurrentPresentationGroupIndex(0)
        setPhase('presentations')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load presentations')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPresentations()
  }, [phase, selectedCategories])

  const toggleCategory = useCallback((id: string, name: string) => {
    setSelectedCategories(prev => {
      if (prev.some(c => c.id === id)) {
        return prev.filter(c => c.id !== id)
      }
      return [...prev, { id, name }]
    })
  }, [])

  const completeCategorySelection = useCallback(() => {
    if (selectedCategories.length > 0) {
      setPhase('loading_presentations')
    }
  }, [selectedCategories.length])

  const togglePresentation = useCallback((categoryId: string, presentationId: string) => {
    setSelectedPresentationsByCategory(prev => {
      const currentIds = prev[categoryId] || []
      if (currentIds.includes(presentationId)) {
        return {
          ...prev,
          [categoryId]: currentIds.filter(id => id !== presentationId)
        }
      }
      return {
        ...prev,
        [categoryId]: [...currentIds, presentationId]
      }
    })
  }, [])

  const nextPresentationGroup = useCallback(() => {
    const isLastGroup = currentPresentationGroupIndex >= presentations.length - 1
    if (isLastGroup) {
      // After the last group of presentations, go to timings phase
      setPhase('timings')
    } else {
      setCurrentPresentationGroupIndex(prev => prev + 1)
    }
  }, [currentPresentationGroupIndex, presentations.length])

  const setPresentationTiming = useCallback(
    (presentationId: string, onset: OnsetBucket | '', trend: Trend | '') => {
      setPresentationTimingById(prev => ({
        ...prev,
        [presentationId]: { onset_bucket: onset, trend },
      }))
    },
    []
  )

  const completeTimings = useCallback(() => {
    setPhase('text_entry')
  }, [])

  const submitChiefComplaint = useCallback(async () => {
    try {
      setPhase('submitting')
      
      // Build selected_categories array in v2 shape
      const selectedCategoriesPayload: ChiefComplaintSelectedCategory[] = presentations
        .map(group => {
          const selectedIds = selectedPresentationsByCategory[group.category_id] || []
          const selected_presentations: ChiefComplaintSelectedPresentation[] = selectedIds.map(
            presentationId => ({
              category_id: group.category_id,
              presentation_id: presentationId,
              timing: presentationTimingById[presentationId] || {
                onset_bucket: '' as OnsetBucket | '',
                trend: '' as Trend | '',
              },
            })
          )

          if (selected_presentations.length === 0) {
            return null
          }

          return {
            category_name: group.category_name,
            category_id: group.category_id,
            selected_presentations,
          } as ChiefComplaintSelectedCategory
        })
        .filter((c): c is ChiefComplaintSelectedCategory => c !== null)

      await questionService.submitChiefComplaint({
        encounter_id: encounterId,
        overall_text: chiefComplaintText,
        selected_categories: selectedCategoriesPayload,
      })
      
      setPhase('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit chief complaint')
      setPhase('text_entry') // Go back to text entry on error
    }
  }, [selectedPresentationsByCategory, chiefComplaintText, encounterId])

  const currentPresentationGroup = presentations[currentPresentationGroupIndex]
  const presentationGroupProgress = presentations.length > 0
    ? currentPresentationGroupIndex / presentations.length
    : 0
  const isLastPresentationGroup = currentPresentationGroupIndex >= presentations.length - 1

  const selectedPresentationsDetailed = presentations.flatMap(group => {
    const selectedIds = selectedPresentationsByCategory[group.category_id] || []
    return group.presentations
      .filter(p => selectedIds.includes(p.id))
      .map(p => ({
        id: p.id,
        label: p.patient_label || p.label,
        description: p.patient_explanation || p.description,
        categoryName: group.category_name,
      }))
  })

  return {
    // State
    phase,
    categories,
    selectedCategories,
    presentations,
    selectedPresentationsByCategory,
    currentPresentationGroup,
    currentPresentationGroupIndex,
    presentationGroupProgress,
    isLastPresentationGroup,
    presentationTimingById,
    selectedPresentationsDetailed,
    chiefComplaintText,
    isLoading,
    error,
    // Actions
    toggleCategory,
    completeCategorySelection,
    togglePresentation,
    nextPresentationGroup,
    setPresentationTiming,
    completeTimings,
    setChiefComplaintText,
    submitChiefComplaint,
    setError,
  }
}
