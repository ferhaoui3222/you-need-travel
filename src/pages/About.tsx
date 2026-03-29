import { useTranslation } from 'react-i18next';
import { CheckCircle2, Users, Globe, Award, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative py-32 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://picsum.photos/seed/about/1920/1080"
            alt="About Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-black mb-8">Redefining Travel in Malaysia</h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed font-medium">
            At You Need Travel, we believe that every journey should be as unique as the traveler. We're on a mission to make travel planning seamless, accessible, and unforgettable.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center border border-gray-100">
          {[
            { label: 'Happy Travelers', value: '50K+', icon: Heart, color: 'text-red-500' },
            { label: 'Destinations', value: '200+', icon: Globe, color: 'text-blue-500' },
            { label: 'Partner Agencies', value: '1.2K+', icon: Users, color: 'text-purple-500' },
            { label: 'Awards Won', value: '15+', icon: Award, color: 'text-yellow-500' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className={`flex justify-center mb-4 ${stat.color}`}>
                <stat.icon className="w-10 h-10" />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-2">{stat.value}</p>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">Our Story & Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in Kuala Lumpur, You Need Travel started with a simple idea: to connect travelers with the authentic beauty of Malaysia. What began as a small local tour operator has grown into a comprehensive B2B and B2C travel ecosystem.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We leverage cutting-edge technology to provide travel agencies and individual tourists with real-time access to the best stays and experiences. Our platform is built on trust, transparency, and a passion for exploration.
            </p>
            <div className="space-y-4 pt-4">
              {[
                'Expertly curated travel packages',
                'Seamless B2B agent integration',
                '24/7 dedicated customer support',
                'Local expertise with global standards'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="text-gray-800 font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-50 rounded-full -z-10" />
            <img
              src="https://picsum.photos/seed/travel/800/1000"
              alt="Travel Experience"
              className="rounded-3xl shadow-2xl w-full object-cover h-[600px]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-20">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Customer First', desc: 'Your satisfaction is our top priority. We go above and beyond to ensure your trip is perfect.', icon: Heart },
              { title: 'Integrity', desc: 'We believe in honest pricing and transparent services. No hidden fees, ever.', icon: ShieldCheck },
              { title: 'Innovation', desc: 'We continuously improve our platform to provide the most efficient booking experience.', icon: Globe },
            ].map((value) => (
              <div key={value.title} className="space-y-6">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
