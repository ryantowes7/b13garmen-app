// components/StatCard.js
'use client';

import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      gradient || 'bg-white'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-2 ${
              gradient ? 'text-white/90' : 'text-gray-600'
            }`}>
              {title}
            </p>
            <p className={`text-3xl font-bold ${
              gradient ? 'text-white' : 'text-gray-900'
            }`}>
              {value}
            </p>
          </div>
          <div className={`p-4 rounded-full ${
            gradient ? 'bg-white/20' : colorClass
          }`}>
            {Icon && <Icon size={28} className={gradient ? 'text-white' : ''} />}
          </div>
        </div>
      </div>
      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 opacity-10">
        {Icon && <Icon size={120} />}
      </div>
    </div>
  );
}