'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User, Mail, Lock, MapPin, Bell, CreditCard, Shield } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Güvenlik', icon: <Shield className="w-5 h-5" /> },
    { id: 'addresses', label: 'Adresler', icon: <MapPin className="w-5 h-5" /> },
    { id: 'notifications', label: 'Bildirimler', icon: <Bell className="w-5 h-5" /> },
    { id: 'payment', label: 'Ödeme Yöntemleri', icon: <CreditCard className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Profil ve Ayarlar</h1>
          <p className="text-gray-600 mt-2">Hesap bilgilerinizi yönetin</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'payment' && <PaymentTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.user.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success('Profil başarıyla güncellendi');
    },
    onError: () => {
      toast.error('Profil güncellenemedi');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İsim</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soyisim</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
              disabled
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">E-posta adresi değiştirilemez</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+90 (5XX) XXX XX XX"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}

function SecurityTab() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }
    toast.success('Şifre başarıyla değiştirildi');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Şifre Değiştir</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Şifreyi Güncelle
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">İki Faktörlü Doğrulama</h2>
        <p className="text-gray-600 mb-6">
          Hesabınızı ekstra güvenlik katmanı ile koruyun. Yakında aktif olacak.
        </p>
        <button
          disabled
          className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
        >
          Yakında Aktif
        </button>
      </div>
    </div>
  );
}

function AddressesTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Adreslerim</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Yeni Adres Ekle
        </button>
      </div>
      <div className="text-center py-16 text-gray-500">
        Henüz kayıtlı adres bulunmamaktadır
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    productUpdates: true,
    cashbackUpdates: true,
    emailNewsletter: false,
    smsNotifications: false,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bildirim Tercihleri</h2>
      <div className="space-y-6">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-4 border-b last:border-b-0">
            <div>
              <h3 className="font-medium text-gray-900">
                {key === 'priceAlerts' && 'Fiyat Düşüş Bildirimleri'}
                {key === 'productUpdates' && 'Ürün Güncellemeleri'}
                {key === 'cashbackUpdates' && 'Cashback Bildirimleri'}
                {key === 'emailNewsletter' && 'E-posta Bülteni'}
                {key === 'smsNotifications' && 'SMS Bildirimleri'}
              </h3>
              <p className="text-sm text-gray-500">
                {key === 'priceAlerts' && 'Favori ürünlerde fiyat düşüşlerinde bildirim al'}
                {key === 'productUpdates' && 'Yeni ürünler ve güncellemeler hakkında bilgi al'}
                {key === 'cashbackUpdates' && 'Cashback işlemleri hakkında bildirim al'}
                {key === 'emailNewsletter' && 'Haftalık kampanya ve fırsatlar'}
                {key === 'smsNotifications' && 'Önemli bildirimler için SMS al'}
              </p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [key]: !value })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      <button className="mt-6 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
        Tercihleri Kaydet
      </button>
    </div>
  );
}

function PaymentTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ödeme Yöntemleri</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Yeni Kart Ekle
        </button>
      </div>
      <div className="text-center py-16 text-gray-500">
        Cashback çekimleriniz için banka hesabı veya kart ekleyin
      </div>
    </div>
  );
}
