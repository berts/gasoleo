import React from 'react';
import ResponsableForm from '../components/responsables/ResponsableForm';
import ResponsableList from '../components/responsables/ResponsableList';

export default function ResponsablesPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ResponsableForm />
        </div>
        <div className="lg:col-span-2">
          <ResponsableList />
        </div>
      </div>
    </div>
  );
}