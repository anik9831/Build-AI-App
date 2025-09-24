import React from 'react';
import { Subject } from '../types/chat';
import { subjects } from '../config/subjects';

interface SubjectSelectorProps {
  onSelectSubject: (subject: Subject) => void;
  selectedSubject?: string;
}

export function SubjectSelector({ onSelectSubject, selectedSubject }: SubjectSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          onClick={() => onSelectSubject(subject)}
          className={`
            p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
            hover:scale-105 hover:shadow-lg
            ${selectedSubject === subject.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">{subject.icon}</span>
            <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {subject.description}
          </p>
        </div>
      ))}
    </div>
  );
}