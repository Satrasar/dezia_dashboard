import React from 'react';
import { X, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BudgetHistory } from '../types';

interface BudgetHistoryModalProps {
  history: BudgetHistory[];
  isOpen: boolean;
  onClose: () => void;
}

const BudgetHistoryModal: React.FC<BudgetHistoryModalProps> = ({ history, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bütçe Artırma Geçmişi</h2>
              <p className="text-gray-400">Otomatik bütçe değişiklikleri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Henüz bütçe değişikliği yok</h3>
              <p className="text-gray-500">Otomatik bütçe artırımları burada görünecek</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        item.success 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.success ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.campaign_name}</h3>
                        <p className="text-sm text-gray-400">ID: {item.campaign_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(item.timestamp).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Eski Bütçe</div>
                      <div className="text-xl font-bold text-gray-300">₺{item.old_budget}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        {item.increase_amount > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-sm text-gray-400">Değişim</span>
                      </div>
                      <div className={`text-xl font-bold ${
                        item.increase_amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.increase_amount > 0 ? '+' : ''}₺{item.increase_amount}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Yeni Bütçe</div>
                      <div className="text-xl font-bold text-white">₺{item.new_budget}</div>
                    </div>
                  </div>

                  <div className="bg-gray-600/30 rounded-lg p-4">
                    <div className="text-sm font-semibold text-white mb-2">Değişiklik Nedeni:</div>
                    <div className="text-sm text-gray-300">{item.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetHistoryModal;