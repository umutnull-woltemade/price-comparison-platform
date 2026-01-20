'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, Gift, Download, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

const statusLabels: Record<string, string> = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
  WITHDRAWN: 'Çekildi',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-blue-100 text-blue-700',
};

export default function CashbackPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: summaryData } = useQuery({
    queryKey: ['cashback-summary'],
    queryFn: () => api.cashback.getSummary(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['cashback-transactions', page, statusFilter],
    queryFn: () => api.cashback.getTransactions(user?.id || '', { page, limit: 20, status: statusFilter }),
    enabled: !!user?.id,
  });

  const summary = summaryData?.data?.summary || {};
  const transactions = transactionsData?.data?.transactions || [];
  const pagination = transactionsData?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Cashback İşlemleri</h1>
          <p className="text-gray-600 mt-2">
            Tüm cashback kazançlarınızı ve işlem geçmişinizi görüntüleyin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
            <Wallet className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{formatPrice(summary.availableBalance || 0)}</div>
            <div className="text-green-100">Kullanılabilir Bakiye</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{formatPrice(summary.totalEarned || 0)}</div>
            <div className="text-blue-100">Toplam Kazanç</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6 shadow-lg">
            <Gift className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{formatPrice(summary.totalPending || 0)}</div>
            <div className="text-yellow-100">Bekleyen</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
            <Download className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{formatPrice(summary.totalWithdrawn || 0)}</div>
            <div className="text-purple-100">Çekilen</div>
          </div>
        </div>

        {/* Withdraw Button */}
        {summary.availableBalance >= 50 && (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Para Çekme</h3>
                <p className="text-gray-600">
                  Bakiyeniz minimum çekim tutarını geçti. Hemen para çekme talebinde bulunabilirsiniz.
                </p>
              </div>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap">
                Para Çek
              </button>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">İşlem Geçmişi</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="PENDING">Beklemede</option>
                  <option value="APPROVED">Onaylandı</option>
                  <option value="REJECTED">Reddedildi</option>
                  <option value="WITHDRAWN">Çekildi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">İşlem bulunamadı</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mağaza</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction: any) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.description || 'Cashback'}</div>
                        {transaction.orderId && (
                          <div className="text-xs text-gray-500">Sipariş: {transaction.orderId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.store?.name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(transaction.amount)}
                        </span>
                        {transaction.commissionRate && (
                          <div className="text-xs text-gray-500">%{transaction.commissionRate}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[transaction.status]}`}>
                          {statusLabels[transaction.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-6 border-t">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Sayfa {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
