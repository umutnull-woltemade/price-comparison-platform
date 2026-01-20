'use client';

import { useState } from 'react';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      // Here you would typically send the email to your backend
    }
  };

  if (submitted) {
    return (
      <section className="py-16 bg-primary-500">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tesekkurler!</h2>
            <p className="text-primary-100">
              E-posta listemize basariyla kaydoldunuz. En iyi firsatlardan haberdar olacaksiniz.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary-500">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">
                Firsatlari Kacirmayin!
              </h2>
              <p className="text-primary-100 mb-6">
                E-posta listemize abone olun, en iyi indirimlerden ve cashback firsatlarindan aninda haberdar olun.
              </p>
              <ul className="space-y-2 text-primary-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Haftalik en iyi firsatlar</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Ozel indirim kodlari</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Yeni urun duyurulari</span>
                </li>
              </ul>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    E-posta Adresiniz
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-12 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Abone Ol</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Abone olarak gizlilik politikamizi kabul etmis olursunuz.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
