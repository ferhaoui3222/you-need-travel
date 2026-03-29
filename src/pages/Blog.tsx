import { useTranslation } from 'react-i18next';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

const posts = [
  { id: 1, title: 'Top 10 Places to Visit in Kuala Lumpur', excerpt: 'Discover the best attractions, from the Petronas Twin Towers to the Batu Caves...', date: 'Mar 20, 2026', author: 'Travel Expert', img: 'blog1' },
  { id: 2, title: 'A Guide to Malaysian Street Food', excerpt: 'Nasi Lemak, Satay, and Laksa - explore the vibrant flavors of Malaysia...', date: 'Mar 18, 2026', author: 'Foodie Guide', img: 'blog2' },
  { id: 3, title: 'Best Beaches in Langkawi for Families', excerpt: 'Planning a family trip? Here are the most child-friendly beaches in Langkawi...', date: 'Mar 15, 2026', author: 'Family Travel', img: 'blog3' },
  { id: 4, title: 'Exploring the Tea Plantations of Cameron Highlands', excerpt: 'Experience the cool breeze and lush green landscapes of the highlands...', date: 'Mar 12, 2026', author: 'Nature Lover', img: 'blog4' },
];

export default function Blog() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Travel Blog & News</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Get inspired for your next journey with our latest travel guides, tips, and stories.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-grow space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${post.img}/800/600`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-400 font-bold mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                  <p className="text-gray-500 mb-6 leading-relaxed">{post.excerpt}</p>
                  <button className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <button className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold">1</button>
            <button className="w-12 h-12 rounded-xl bg-white border font-bold hover:bg-gray-50">2</button>
            <button className="w-12 h-12 rounded-xl bg-white border font-bold hover:bg-gray-50">3</button>
            <button className="w-12 h-12 rounded-xl bg-white border font-bold hover:bg-gray-50">Next</button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Search Blog</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Keywords..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-4">
              {['Travel Tips', 'Destinations', 'Food & Drink', 'Adventure', 'Family Travel'].map((cat) => (
                <li key={cat}>
                  <a href="#" className="flex justify-between items-center text-gray-600 hover:text-blue-600 font-medium group">
                    {cat}
                    <span className="bg-gray-50 px-2 py-1 rounded-lg text-xs font-bold group-hover:bg-blue-50">12</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-600 p-8 rounded-3xl shadow-xl text-white text-center">
            <h3 className="text-xl font-bold mb-4">Subscribe to Newsletter</h3>
            <p className="text-blue-100 text-sm mb-6">Get the latest travel news and special offers directly in your inbox.</p>
            <input type="email" placeholder="Your Email" className="w-full px-4 py-3 bg-white/10 border-none rounded-xl placeholder:text-blue-200 text-white focus:ring-2 focus:ring-white mb-4" />
            <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
              Subscribe
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
