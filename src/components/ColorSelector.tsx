import React from 'react';
import { ProductVariant } from '@/types/database';

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  variants,
  selectedVariantId,
  onSelectVariant,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Color:{' '}
        <span className="font-semibold text-black">
          {variants.find((v) => v.id === selectedVariantId)?.colorName}
        </span>
      </label>
      <div className="flex items-center gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariant(variant)}
              className={`relative h-9 w-9 rounded-full border-2 transition-all ${
                isSelected
                  ? 'border-black scale-110 shadow-sm'
                  : 'border-transparent hover:scale-105'
              }`}
              title={variant.colorName}
            >
              <span
                className="block h-full w-full rounded-full border border-black/10"
                style={{ backgroundColor: variant.colorHex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};