import React from 'react';
import { Plus } from 'lucide-react';

interface QuickFormProps {
  onAdd: () => void;
  children: React.ReactNode;
  showAddButton?: boolean;
}

export default function QuickForm({ onAdd, children, showAddButton = true }: QuickFormProps) {
  return (
    <div className="relative">
      {children}
      {showAddButton && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
}