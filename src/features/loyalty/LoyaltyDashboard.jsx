import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoyaltyDashboard = ({ points, tier }) => {
  const { t } = useTranslation();

  // টায়ার অনুযায়ী কালার কোড
  const tierColors = {
    Bronze: 'text-orange-600 bg-orange-50 border-orange-200',
    Silver: 'text-slate-500 bg-slate-50 border-slate-200',
    Gold: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    Platinum: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Star size={32} fill="currentColor" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {t('loyalty.current_points')}
          </p>
          <h3 className="text-3xl font-black text-gray-900">
            {points}{' '}
            <span className="text-sm font-bold text-gray-500">PTS</span>
          </h3>
        </div>
      </div>

      <div
        className={`px-6 py-3 rounded-2xl border-2 flex items-center space-x-3 ${tierColors[tier] || tierColors.Bronze}`}
      >
        <Crown size={24} />
        <div>
          <p className="text-[10px] font-black uppercase tracking-tighter opacity-70">
            {t('loyalty.membership_tier')}
          </p>
          <h4 className="text-lg font-bold leading-none">{tier}</h4>
        </div>
      </div>

      <Link
        to="/loyalty"
        className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all text-sm"
      >
        <span>{t('loyalty.view_details')}</span>
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
};

export default LoyaltyDashboard;
