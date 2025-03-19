
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLatestNews } from '@/services/dataService';
import { Badge } from '@/components/ui/badge';
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
  'Innovation': 'bg-purple-100 text-purple-800',
  'Sustainability': 'bg-green-100 text-green-800',
  'Market Analysis': 'bg-blue-100 text-blue-800',
  'Technology': 'bg-indigo-100 text-indigo-800',
  'Logistics': 'bg-amber-100 text-amber-800',
  'default': 'bg-gray-100 text-gray-800'
};

const LatestIndustryNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await getLatestNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching latest industry news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-ey-darkGray flex items-center">
            <Newspaper className="h-6 w-6 text-purple-500 mr-2" />
            Latest Industry News
          </h2>
          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-600">
            Steel Industry Updates
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse h-48">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mt-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-ey-darkGray flex items-center">
          <Newspaper className="h-6 w-6 text-purple-500 mr-2" />
          Latest Industry News
        </h2>
        <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-600">
          Steel Industry Updates
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <Badge className={`self-start mb-2 ${categoryColors[item.category] || categoryColors.default}`}>
                {item.category}
              </Badge>
              <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-3">{item.summary}</p>
              <div className="mt-auto pt-2 flex items-center justify-between text-xs text-gray-400 border-t">
                <span>{item.source}</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Link to="/news">
          <Button variant="outline" size="sm" className="text-purple-500 border-purple-200 hover:bg-purple-50">
            View All News
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default LatestIndustryNews;
