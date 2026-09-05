import React, { useState } from 'react';
import { Trash2, XCircle } from 'lucide-react';

const FlaggedItemsView = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Expensive Watch', reason: 'Counterfeit' },
    { id: 2, name: 'Old Phone', reason: 'Misleading description' },
  ]);

  const handleAction = (id, action) => {
    console.log(`Action ${action} on item ${id}`);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Flagged Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-black text-slate-800">{item.name}</h3>
              <p className="text-sm text-slate-500">Reason: {item.reason}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(item.id, 'remove')}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => handleAction(item.id, 'dismiss')}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlaggedItemsView;
