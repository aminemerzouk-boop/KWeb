import React, { useState } from 'react';
import { CustomMeasurements } from '@/types/database';

interface CustomSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (measurements: CustomMeasurements) => void;
}

export const CustomSizeModal: React.FC<CustomSizeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [measurements, setMeasurements] = useState<CustomMeasurements>({
    bustCm: undefined,
    waistCm: undefined,
    hipsCm: undefined,
    heightCm: undefined,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(measurements);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900">Enter Your Measurements</h3>
        <p className="mt-1 text-sm text-gray-500">
          Provide your dimensions in centimeters so our tailors can sew this specifically for you.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bust (cm)</label>
            <input
              type="number"
              name="bustCm"
              required
              min="40"
              max="200"
              value={measurements.bustCm || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              placeholder="e.g. 88"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Waist (cm)</label>
            <input
              type="number"
              name="waistCm"
              required
              min="40"
              max="200"
              value={measurements.waistCm || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              placeholder="e.g. 68"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hips (cm)</label>
            <input
              type="number"
              name="hipsCm"
              required
              min="40"
              max="200"
              value={measurements.hipsCm || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              placeholder="e.g. 96"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Height (cm)</label>
            <input
              type="number"
              name="heightCm"
              required
              min="100"
              max="220"
              value={measurements.heightCm || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              placeholder="e.g. 168"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 rounded-md bg-black py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Save Measurements
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};