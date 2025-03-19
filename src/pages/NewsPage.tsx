
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, Filter, Calendar, Clock, ExternalLink } from 'lucide-react';
import { getLatestNews } from '@/services/dataService';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  'Innovation': 'bg-purple-100 text-purple-800 border-purple-200',
  'Sustainability': 'bg-green-100 text-green-800 border-green-200',
  'Market Analysis': 'bg-blue-100 text-blue-800 border-blue-200',
  'Technology': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Logistics': 'bg-amber-100 text-amber-800 border-amber-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await getLatestNews();
        // Simulate more news items
        const extendedNews = [...newsData];
        for (let i = 0; i < 10; i++) {
          const originalItem = newsData[i % newsData.length];
          extendedNews.push({
            ...originalItem,
            id: originalItem.id + 100 + i,
            date: new Date(new Date(originalItem.date).getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          });
        }
        setNews(extendedNews);
      } catch (error) {
        console.error('Error fetching latest industry news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  const categories = Array.from(new Set(news.map(item => item.category)));
  
  const filteredNews = news.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle="Steel Industry News" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Steel Industry News & Insights</h1>
              <p className="text-white/80">Stay updated with the latest news, trends, and innovations in the steel manufacturing industry</p>
            </div>
          </div>
        </motion.div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search news..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-4 w-4" />
              <span className="text-sm text-gray-500">Filter by category:</span>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer ${selectedCategory === '' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100'}`}
                  onClick={() => setSelectedCategory('')}
                >
                  All
                </Badge>
                {categories.map(category => (
                  <Badge 
                    key={category}
                    variant="outline" 
                    className={`cursor-pointer ${selectedCategory === category ? categoryColors[category] || categoryColors.default : 'bg-gray-100'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredNews.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <Badge className={`mr-2 ${categoryColors[item.category] || categoryColors.default}`}>
                            {item.category}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </div>
                        <h3 className="font-medium mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium mr-4">Source: {item.source}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0 ml-4">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Read More
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredNews.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No news found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
