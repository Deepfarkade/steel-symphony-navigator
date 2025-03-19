
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Filter, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModuleLayout from '@/components/ModuleLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getLatestNews } from '@/services/dataService';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  category?: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const newsData = await getLatestNews();
        setNews(newsData);
        setFilteredNews(newsData);
      } catch (error) {
        console.error('Error fetching news data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredNews(filtered);
    }
  }, [searchTerm, news]);
  
  return (
    <ModuleLayout
      title="Industry News"
      description="Latest updates and insights from the steel industry"
      icon={<ArrowLeft className="h-5 w-5 text-ey-yellow" />}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
            
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 bg-gray-200 rounded-md"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No news articles matching your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredNews.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        {item.imageUrl && (
                          <div className="md:w-1/4 lg:w-1/5">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-auto rounded-md object-cover"
                              style={{ maxHeight: '120px' }}
                            />
                          </div>
                        )}
                        <div className={`${item.imageUrl ? 'md:w-3/4 lg:w-4/5' : 'w-full'}`}>
                          <h3 className="font-medium text-lg text-ey-darkGray mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.summary}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500">{item.source}</span>
                              {item.category && (
                                <>
                                  <Separator orientation="vertical" className="h-4" />
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">{item.publishedAt}</span>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default NewsPage;
