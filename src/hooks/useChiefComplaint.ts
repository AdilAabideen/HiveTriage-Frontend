/**
 * Hook for managing chief complaint flow (categories, subcategories, timing, text)
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  ChiefComplaintCategory, 
  CategorySelectionItem, 
  ChiefComplaintSubcategory,
  ChiefComplaintSubcategoriesResponse,
  OnsetBucket,
  Trend,
  ChiefComplaintSelection
} from '../types'
import { questionService } from '../services/questionService'

export type ChiefComplaintPhase = 
  | 'loading_categories'
  | 'categories'
  | 'loading_subcategories'
  | 'subcategories'
  | 'text_entry'
  | 'submitting'
  | 'complete'

export function useChiefComplaint(encounterId: string | null, shouldStart: boolean) {
  const [phase, setPhase] = useState<ChiefComplaintPhase>('loading_categories')
  const [categories, setCategories] = useState<ChiefComplaintCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<CategorySelectionItem[]>([])
  const [subcategories, setSubcategories] = useState<ChiefComplaintSubcategory[]>([])
  const [selectedSubcategoriesByCategory, setSelectedSubcategoriesByCategory] = useState<Record<string, string[]>>({})
  const [currentSubcategoryGroupIndex, setCurrentSubcategoryGroupIndex] = useState(0)
  const [categoryTimingData, setCategoryTimingData] = useState<Record<string, { onsetBucket: OnsetBucket | ''; trend: Trend | '' }>>({})
  const [chiefComplaintText, setChiefComplaintText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch categories when started
  useEffect(() => {
    if (!shouldStart) return
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const data: ChiefComplaintCategory[] = await questionService.getChiefComplaintCategories()
        setCategories(data)
        setPhase('categories')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [shouldStart])

  // Fetch subcategories when category selection is complete
  useEffect(() => {
    if (phase !== 'loading_subcategories' || selectedCategories.length === 0) return
    
    const fetchSubcategories = async () => {
      try {
        setIsLoading(true)
        const response: ChiefComplaintSubcategoriesResponse = await questionService.getChiefComplaintSubcategories(
          { categories: selectedCategories }
        )
        setSubcategories(response.subcategories)
        setCurrentSubcategoryGroupIndex(0)
        setPhase('subcategories')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subcategories')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubcategories()
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
      setPhase('loading_subcategories')
    }
  }, [selectedCategories.length])

  const toggleSubcategory = useCallback((categoryId: string, familyId: string) => {
    setSelectedSubcategoriesByCategory(prev => {
      const currentFamilyIds = prev[categoryId] || []
      if (currentFamilyIds.includes(familyId)) {
        return {
          ...prev,
          [categoryId]: currentFamilyIds.filter(id => id !== familyId)
        }
      }
      return {
        ...prev,
        [categoryId]: [...currentFamilyIds, familyId]
      }
    })
  }, [])

  const setCategoryTiming = useCallback((categoryId: string, onsetBucket: OnsetBucket | '', trend: Trend | '') => {
    setCategoryTimingData(prev => ({
      ...prev,
      [categoryId]: { onsetBucket, trend }
    }))
  }, [])

  const nextSubcategoryGroup = useCallback(() => {
    const isLastGroup = currentSubcategoryGroupIndex >= subcategories.length - 1
    if (isLastGroup) {
      setPhase('text_entry')
    } else {
      setCurrentSubcategoryGroupIndex(prev => prev + 1)
    }
  }, [currentSubcategoryGroupIndex, subcategories.length])

  const submitChiefComplaint = useCallback(async () => {
    try {
      setPhase('submitting')
      
      // Build selections array
      const selections: ChiefComplaintSelection[] = Object.keys(categoryTimingData).map(categoryId => ({
        category_id: categoryId,
        onset_bucket: categoryTimingData[categoryId].onsetBucket,
        trend: categoryTimingData[categoryId].trend,
        family_ids: selectedSubcategoriesByCategory[categoryId] || []
      }))

      await questionService.submitChiefComplaint({
        encounter_id: encounterId,
        selections,
        overall_text: chiefComplaintText
      })
      
      setPhase('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit chief complaint')
      setPhase('text_entry') // Go back to text entry on error
    }
  }, [categoryTimingData, selectedSubcategoriesByCategory, chiefComplaintText, encounterId])

  const currentSubcategoryGroup = subcategories[currentSubcategoryGroupIndex]
  const subcategoryGroupProgress = subcategories.length > 0
    ? currentSubcategoryGroupIndex / subcategories.length
    : 0
  const isLastSubcategoryGroup = currentSubcategoryGroupIndex >= subcategories.length - 1

  return {
    // State
    phase,
    categories,
    selectedCategories,
    subcategories,
    selectedSubcategoriesByCategory,
    currentSubcategoryGroup,
    currentSubcategoryGroupIndex,
    subcategoryGroupProgress,
    isLastSubcategoryGroup,
    categoryTimingData,
    chiefComplaintText,
    isLoading,
    error,
    // Actions
    toggleCategory,
    completeCategorySelection,
    toggleSubcategory,
    setCategoryTiming,
    nextSubcategoryGroup,
    setChiefComplaintText,
    submitChiefComplaint,
    setError,
  }
}

