import { Search, BarChart3, MousePointer, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Arayin',
    description: 'Almak istediginiz urunu arayin veya kategorilerden secin.',
    color: 'bg-blue-500',
  },
  {
    icon: BarChart3,
    number: '02',
    title: 'Karsilastirin',
    description: 'Onlarca magazadan en iyi fiyati bulun ve karsilastirin.',
    color: 'bg-purple-500',
  },
  {
    icon: MousePointer,
    number: '03',
    title: 'Satin Alin',
    description: 'Linke tiklayarak magazadan guvenle alisveris yapin.',
    color: 'bg-pink-500',
  },
  {
    icon: Wallet,
    number: '04',
    title: 'Cashback Kazanin',
    description: 'Her alisverisde %10\'a varan para iadesi kazanin.',
    color: 'bg-primary-500',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nasil Calisir?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            FiyatRadar ile alisveris yapmak cok kolay. Sadece 4 adimda en iyi fiyatlari bulun ve cashback kazanin.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-primary-500" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Step Number Badge */}
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hemen Baslayin ve Tasarruf Etmeye Baslayin!
              </h3>
              <p className="text-gray-500 mb-6">
                Ucretsiz hesap olusturun, fiyat alarmlari kurun ve her alisveriste cashback kazanmaya baslayin.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>%10&apos;a varan cashback</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Fiyat dususlerinde otomatik bildirim</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>500+ guvenilir magaza</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                <span>Ucretsiz Kayit Ol</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border-2 border-gray-200 hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                <span>Urunleri Incele</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
