
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, Filter, Clock, Calendar, BookOpen } from 'lucide-react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { getLatestNews } from '@/services/dataService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await getLatestNews();
        setNews(newsData);
        setFilteredNews(newsData);
      } catch (error) {
        console.error('Error fetching industry news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  useEffect(() => {
    let result = [...news];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    setFilteredNews(result);
  }, [searchQuery, selectedCategory, news]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  const getUniqueCategories = () => {
    const categories = news.map(item => item.category);
    return [...new Set(categories)];
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div data-main-content className="ml-64 p-8 transition-all duration-300">
        <Header 
          pageTitle="Industry News & Updates"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'News', link: '/news' }
          ]}
        />
        
        <div className="mb-8">
          <Card>
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Steel Industry News</CardTitle>
                  <CardDescription className="text-white/80">
                    Stay updated with the latest developments in the steel industry
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Search news articles..." 
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedCategory === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleCategoryFilter(null)}
                  >
                    All
                  </Button>
                  {getUniqueCategories().map(category => (
                    <Button 
                      key={category} 
                      variant={selectedCategory === category ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Tabs defaultValue="latest">
                <TabsList className="mb-6">
                  <TabsTrigger value="latest">
                    <Clock className="h-4 w-4 mr-2" />
                    Latest
                  </TabsTrigger>
                  <TabsTrigger value="trending">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Most Read
                  </TabsTrigger>
                  <TabsTrigger value="upcoming">
                    <Calendar className="h-4 w-4 mr-2" />
                    Upcoming
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="latest" className="mt-0">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
                      ))}
                    </div>
                  ) : filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredNews.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <Badge className={`${categoryColors[item.category] || categoryColors.default}`}>
                              {item.category}
                            </Badge>
                            <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{item.summary}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{item.source}</span>
                            <Button variant="link" size="sm" className="text-purple-600">
                              Read More
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Newspaper className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-ey-darkGray mb-2">No news found</h3>
                      <p className="text-ey-lightGray">
                        {searchQuery ? 'No articles match your search criteria.' : 'There are no news articles available at the moment.'}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="trending" className="mt-0">
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-ey-darkGray mb-2">Most Read Articles</h3>
                    <p className="text-ey-lightGray">Coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming" className="mt-0">
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-ey-darkGray mb-2">Upcoming Industry Events</h3>
                    <p className="text-ey-lightGray">Coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
