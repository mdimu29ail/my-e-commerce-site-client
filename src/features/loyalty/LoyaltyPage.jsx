import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Gift,
  History,
  Info,
  ShieldCheck,
  Zap,
  Coins,
  ChevronRight,
} from 'lucide-react';
import Loader from '../../components/shared/Loader';
import LoyaltyDashboard from './LoyaltyDashboard';

const LoyaltyPage = () => {
  const { t, i18n } = useTranslation();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/loyalty/status`, {
          withCredentials: true,
        });
        setLoyaltyData(data);
      } catch (error) {
        console.error('Error fetching loyalty status');
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, [API_URL]);

  if (loading) return <Loader fullScreen />;

  const progressPercent =
    (loyaltyData?.points / loyaltyData?.nextTierRequirement) * 100;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* হেডার */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900">
            {t('loyalty.page_title')}
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            {t('loyalty.page_subtitle')}
          </p>
        </div>

        {/* ড্যাশবোর্ড উইজেট */}
        <LoyaltyDashboard
          points={loyaltyData?.points || 0}
          tier={loyaltyData?.tier || 'Bronze'}
        />

        {/* টায়ার প্রগ্রেস কার্ড */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-gray-800 flex items-center">
              <Zap size={18} className="text-orange-500 mr-2" />{' '}
              {t('loyalty.tier_progress')}
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
              {loyaltyData?.nextTierRequirement - loyaltyData?.points} PTS TO
              NEXT TIER
            </span>
          </div>

          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
              style={{
                width: `${progressPercent > 100 ? 100 : progressPercent}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>{loyaltyData?.tier}</span>
            <span>Next Level</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* রিডিম অপশন (পয়েন্ট থেকে টাকা) */}
          <div className="bg-indigo-900 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
            <Coins
              size={80}
              className="absolute -right-5 -bottom-5 opacity-10 rotate-12"
            />
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <Gift className="mr-2 text-orange-400" />{' '}
              {t('loyalty.redeem_title')}
            </h3>
            <p className="text-indigo-200 text-sm mb-6">
              {t('loyalty.redeem_desc')}
            </p>
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/20">
              <div>
                <p className="text-xs font-bold opacity-60 uppercase">
                  Estimate Discount
                </p>
                <h4 className="text-2xl font-black">
                  ৳{Math.floor(loyaltyData?.points / 10)}
                </h4>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg">
                {t('loyalty.redeem_btn')}
              </button>
            </div>
          </div>

          {/* হাউ ইট ওয়ার্কস */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Info className="mr-2 text-blue-600" />{' '}
              {t('loyalty.how_it_works')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <ShieldCheck size={18} className="text-green-500 shrink-0" />
                <span>{t('loyalty.rule_1')}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <ShieldCheck size={18} className="text-green-500 shrink-0" />
                <span>{t('loyalty.rule_2')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* পয়েন্ট ইতিহাস (History) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <History size={20} className="mr-2 text-gray-400" />{' '}
              {t('loyalty.history')}
            </h3>
          </div>
          <div className="divide-y">
            {loyaltyData?.history?.length > 0 ? (
              loyaltyData.history.map((h, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-xl ${h.points > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                    >
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        {i18n.language === 'en'
                          ? h.descriptionEn
                          : h.descriptionBn}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        {new Date(h.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-black ${h.points > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {h.points > 0 ? `+${h.points}` : h.points}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-10 text-center text-gray-400">
                {t('loyalty.no_history')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
