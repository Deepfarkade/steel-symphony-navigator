
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Search, 
  Filter, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  Bell, 
  Radio, 
  Tag, 
  Calendar, 
  ArrowLeft, 
  Eye, 
  ArrowRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { getLatestNews } from '@/services/dataService';
import { faker } from '@faker-js/faker';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: string;
  content?: string;
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
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  
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
    
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
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
  
  const handleReadMore = (article: NewsItem) => {
    setSelectedArticle(article);
  };
  
  const generateFullContent = (article: NewsItem) => {
    if (article.content) return article.content;
    
    return `${article.summary}\n\n${faker.lorem.paragraphs(3)}\n\n${faker.lorem.paragraphs(2)}`;
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
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Latest
                  </TabsTrigger>
                  <TabsTrigger value="trending">
                    <FileText className="h-4 w-4 mr-2" />
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
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-purple-600 flex items-center"
                              onClick={() => handleReadMore(item)}
                            >
                              Read More
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
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
      
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedArticle?.title}
            </DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={`${categoryColors[selectedArticle?.category || 'default'] || categoryColors.default}`}>
                  {selectedArticle?.category}
                </Badge>
                <span className="text-xs text-gray-500">{selectedArticle?.source}</span>
              </div>
              <span className="text-xs text-gray-400">
                {selectedArticle && new Date(selectedArticle.date).toLocaleDateString()}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto py-4">
            {selectedArticle && (
              <div className="space-y-4 text-gray-700">
                <p className="font-medium">{selectedArticle.summary}</p>
                <div className="prose max-w-none">
                  {selectedArticle.content || (
                    <>
                      <p>{faker.lorem.paragraph(5)}</p>
                      <p>{faker.lorem.paragraph(4)}</p>
                      <h3 className="text-lg font-medium mt-6 mb-2">Key Implications for Steel Industry</h3>
                      <p>{faker.lorem.paragraph(3)}</p>
                      <ul className="list-disc pl-5 my-4">
                        <li>{faker.lorem.sentence()}</li>
                        <li>{faker.lorem.sentence()}</li>
                        <li>{faker.lorem.sentence()}</li>
                      </ul>
                      <p>{faker.lorem.paragraph(3)}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedArticle(null)}>
              Close
            </Button>
            <Button>Share Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsPage;
