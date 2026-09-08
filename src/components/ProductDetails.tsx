import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductVariant, SizeOption, CustomMeasurements } from '@/types/database';
import { ColorSelector } from './ColorSelector';
import { CustomSizeModal } from './CustomSizeModal';

interface ProductDetailsProps {
  product: Product;
  userId?: string;
  onAddToCart: (item: {
    productId: string;
    variantId: string;
    size: SizeOption;
    customMeasurements?: CustomMeasurements;
    quantity: number;
    price: number;
  }) => void;
  onToggleFavorite: (productId: string, isFav: boolean) => Promise<void>;
  isFavoriteInitial?: boolean;
}

const SIZES: SizeOption[] = ['S', 'M', 'L', 'Custom'];

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavoriteInitial = false,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {}
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M');
  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurements | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [favLoading, setFavLoading] = useState(false);

  const activeImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : ['/placeholder-dress.jpg'];

  const handleSizeSelect = (size: SizeOption) => {
    setSelectedSize(size);
    if (size === 'Custom') {
      setIsModalOpen(true);
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
  };

  const handleFavClick = async () => {
    setFavLoading(true);
    try {
      await onToggleFavorite(product.id, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (selectedSize === 'Custom' && !customMeasurements) {
      setIsModalOpen(true);
      return;
    }

    onAddToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      size: selectedSize,
      customMeasurements: customMeasurements || undefined,
      quantity: 1,
      price: product.basePrice,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={activeImages[selectedImageIndex]}
              alt={product.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          {activeImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {activeImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    idx === selectedImageIndex ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Meta & Purchase Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.title}
              </h1>
              <button
                onClick={handleFavClick}
                disabled={favLoading}
                className="rounded-full p-2 hover:bg-gray-100 transition"
                title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <svg
                  className={`h-7 w-7 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'
                  }`}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              ${product.basePrice.toFixed(2)}
            </p>

            <div className="mt-4 text-sm text-gray-600 leading-relaxed">
              {product.description}
            </div>

            {/* Color Variant Selector */}
            <div className="mt-6">
              <ColorSelector
                variants={product.variants}
                selectedVariantId={selectedVariant.id}
                onSelectVariant={handleVariantChange}
              />
            </div>

            {/* Size Selector */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Select Size</label>
                {selectedSize === 'Custom' && customMeasurements && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs text-black underline"
                  >
                    Edit Measurements
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeSelect(size)}
                    className={`rounded-md py-2.5 text-sm font-medium border transition ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-800 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button: Pay on Delivery Order */}
          <div className="pt-4 border-t">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-md bg-black py-4 text-center font-medium text-white hover:bg-gray-800 transition"
            >
              Add to Cart (Pay on Delivery)
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Custom Measurements */}
      <CustomSizeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(m) => setCustomMeasurements(m)}
      />
    </div>
  );
};