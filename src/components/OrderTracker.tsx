import React from 'react';
import { OrderStatus } from '@/types/database';

interface OrderTrackerProps {
  status: OrderStatus;
}

const STEPS: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'pending', label: 'Order Placed', description: 'Order logged (Pay on Delivery)' },
  { key: 'processing', label: 'Tailoring', description: 'Garment is being sewn' },
  { key: 'shipped', label: 'Out for Delivery', description: 'Courier dispatched' },
  { key: 'delivered', label: 'Delivered', description: 'Payment collected' },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="rounded-md bg-red-50 p-4 text-center text-red-700">
        This order has been cancelled.
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="py-6">
      <div className="relative flex items-center justify-between">
        {/* Step Progress Line */}
        <div className="absolute left-0 top-1/2 -z-0 h-1 w-full -translate-y-1/2 bg-gray-200" />
        <div
          className="absolute left-0 top-1/2 -z-0 h-1 -translate-y-1/2 bg-black transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const isPassed = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isPassed
                    ? 'bg-black text-white'
                    : 'border-2 border-gray-300 bg-white text-gray-400'
                } ${isCurrent ? 'ring-4 ring-black/20' : ''}`}
              >
                {idx + 1}
              </div>
              <p
                className={`mt-2 text-xs font-semibold ${
                  isPassed ? 'text-black' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
              <p className="hidden text-[10px] text-gray-500 sm:block">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};