import { Search, ShoppingCart, Gift, Wallet } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-12 h-12" />,
      title: 'Arayın',
      description: 'Almak istediğiniz ürünü arayın veya kategorilerden seçin',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <ShoppingCart className="w-12 h-12" />,
      title: 'Karşılaştırın',
      description: 'Onlarca mağazadan en iyi fiyatı bulun ve karşılaştırın',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <Gift className="w-12 h-12" />,
      title: 'Alışveriş Yapın',
      description: 'Linke tıklayarak mağazadan güvenle alışveriş yapın',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: <Wallet className="w-12 h-12" />,
      title: 'Cashback Kazanın',
      description: 'Her alışverişinizden %5\'e kadar para iadesi kazanın',
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            FiyatKarşılaştır ile alışveriş yapmak çok kolay. Sadece 4 adımda en iyi fiyatları bulun ve cashback kazanın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-green-500 -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className={`bg-gradient-to-br ${step.color} text-white rounded-2xl p-6 mb-6 shadow-xl`}>
                  <div className="relative">
                    {step.icon}
                    <div className="absolute -top-3 -right-3 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Hemen Başlayın ve Tasarruf Etmeye Başlayın!
          </h3>
          <p className="text-gray-600 mb-6">
            Ücretsiz hesap oluşturun ve her alışverişinizden cashback kazanmaya başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Ücretsiz Kayıt Ol
            </a>
            <a
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-primary-600"
            >
              Ürünleri İncele
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
