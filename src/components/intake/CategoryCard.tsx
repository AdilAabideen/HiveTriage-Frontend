import { useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { ChiefComplaintCategory } from '../../types'
import { renderIcon } from '../../utils/iconMap'

export interface CategoryCardProps {
  category: ChiefComplaintCategory
  isSelected: boolean
  onToggle: () => void
}

export function CategoryCard({ category, isSelected, onToggle }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        flex flex-col items-start justify-start w-full cursor-pointer
        hover:scale-[1.01] ease-in-out transition-all duration-300 rounded-lg p-4 px-3 relative
        ${isSelected
          ? 'bg-white ring-2 ring-white'
          : isHovered
            ? 'bg-complementary/70'
            : 'bg-complementary/50'
        }
      `}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div className={`text-lg font-medium text-start ${isSelected ? 'text-nhs' : 'text-black'}`}>
          <div className="flex flex-row items-center justify-center gap-2">
            {renderIcon(category.icon, { className: 'text-4xl' })}
            <p className="text-md font-medium text-start">{category.label}</p>
          </div>
        </div>
        {isSelected && (
          <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 bg-nhs rounded-full z-10">
            <BsCheckLg className="text-white text-sm" />
          </div>
        )}
      </div>
      <p className={`text-sm font-light text-start mt-1 ${isSelected ? 'text-nhs/70' : 'text-black/70'}`}>
        {category.description}
      </p>
    </div>
  )
}

export default CategoryCard

