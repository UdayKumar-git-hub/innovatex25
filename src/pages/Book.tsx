import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, BookHeart } from 'lucide-react';

interface PageContent {
  id: string;
  type: 'cover' | 'content' | 'back';
  title?: string;
  subtitle?: string;
  image?: string;
  icon?: React.ReactNode;
}

const InteractiveBook: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  // Updated book content to be image-focused
  const pages: PageContent[] = [
    { id: 'page0', type: 'content', image: 'https://i.postimg.cc/Sj0ZNvbN/innovatex25-Recovered.jpg' },
    
    // --- Content Pages with Images Only ---
    { id: 'page1', type: 'content', image: 'https://i.postimg.cc/VknxMXKV/price.jpg' },
    { id: 'page2', type: 'content', image: 'https://i.postimg.cc/vZrKDbBR/3rdpage.jpg' },
    { id: 'page3', type: 'content', image: 'https://i.postimg.cc/R0VzBNTp/ipl-poster-Copy.jpg' },
    { id: 'page4', type: 'content', image: 'https://placehold.co/400x500/f0fdf4/16a34a?text=Memories' },
    { id: 'page5', type: 'content', image: 'https://placehold.co/400x500/f7fee7/65a30d?text=Growth' },
    { id: 'page6', type: 'content', image: 'https://placehold.co/400x500/f1f5f9/475569?text=Resilience' },
    { id: 'page7', type: 'content', image: 'https://placehold.co/400x500/eef2ff/4338ca?text=Courage' },
    { id: 'page8', type: 'content', image: 'https://placehold.co/400x500/fefce8/ca8a04?text=Kindness' },
    { id: 'page9', type: 'content', image: 'https://placehold.co/400x500/fff7ed/f97316?text=Gratitude' },
    { id: 'page10', type: 'content', image: 'https://placehold.co/400x500/ecfeff/0891b2?text=Purpose' },
    { id: 'page11', type: 'content', image: 'https://placehold.co/400x500/fdf2f8/d946ef?text=Laughter' },
    { id: 'page12', type: 'content', image: 'https://placehold.co/400x500/f5f3ff/7c3aed?text=Wisdom' },
    { id: 'page13', type: 'content', image: 'https://placehold.co/400x500/fee2e2/b91c1c?text=Connection' },
    { id: 'page14', type: 'content', image: 'https://placehold.co/400x500/e0f2fe/0ea5e9?text=Stillness' },
    { id: 'page15', type: 'content', image: 'https://placehold.co/400x500/fdf4ff/c026d3?text=Forgiveness' },
    { id: 'page16', type: 'content', image: 'https://placehold.co/400x500/fffbeb/d97706?text=Legacy' },
    // --- Back Cover ---
    {
      id: 'back',
      type: 'back',
      title: 'The End',
      subtitle: 'Your own journey is just beginning.',
    }
  ];
  
  const pageCount = pages.length;

  const nextPage = () => {
    if (currentPage < pageCount - 1 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(prev => prev + 1);
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(prev => prev - 1);
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') nextPage();
      if (event.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, isFlipping]);

  const getPageClass = (pageType: 'cover' | 'content' | 'back') => {
    switch(pageType) {
      case 'cover': return 'bg-gradient-to-br from-amber-800 to-amber-900';
      case 'back': return 'bg-gradient-to-br from-slate-700 to-slate-800';
      default: return 'bg-white';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div 
        ref={bookRef}
        className="relative"
        style={{ perspective: '1500px' }}
      >
        <div 
          className="relative w-80 h-[480px] md:w-96 md:h-[560px] transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-15deg) rotateX(5deg)' }}
        >
          {/* Book Spine */}
          <div className="absolute -left-6 top-0 w-6 h-full bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-l-md shadow-2xl transform -skew-y-1"></div>
          
          {/* Pages Stack Effect */}
          <div className="absolute top-1 right-1 w-full h-full bg-gray-100 rounded-r-md -z-10 shadow-inner"></div>
          <div className="absolute top-2 right-2 w-full h-full bg-gray-200 rounded-r-md -z-20"></div>

          {/* Page Container */}
          <div className="relative w-full h-full bg-white rounded-r-md shadow-2xl overflow-hidden">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col
                  ${index === currentPage ? 'opacity-100 translate-x-0 z-10' : ''}
                  ${index < currentPage ? 'opacity-0 -translate-x-full z-0' : ''}
                  ${index > currentPage ? 'opacity-0 translate-x-full z-0' : ''}
                  ${getPageClass(page.type)}`}
              >
                {page.type === 'cover' && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-white p-6">
                    <div className="mb-6 opacity-80">{page.icon}</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">{page.title}</h1>
                    <p className="text-lg opacity-90 drop-shadow">{page.subtitle}</p>
                    <div className="absolute bottom-8 left-8 right-8 border-t border-white/30 pt-4">
                      <p className="text-sm opacity-70">Interactive Edition</p>
                    </div>
                  </div>
                )}

                {page.type === 'content' && (
                  <div className="flex-1 flex items-center justify-center p-2">
                    {page.image && (
                      <img 
                        src={page.image} 
                        alt={`Page ${index}`}
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                )}

                {page.type === 'back' && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-white p-6">
                    <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">{page.title}</h2>
                    <p className="text-lg opacity-90 drop-shadow mb-8">{page.subtitle}</p>
                    <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-8 w-80 md:w-96">
        <button
          onClick={prevPage}
          disabled={currentPage === 0 || isFlipping}
          className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-amber-600 text-white hover:bg-amber-700 hover:shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentPage ? 'bg-amber-600 w-6' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage === pageCount - 1 || isFlipping}
          className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-amber-600 text-white hover:bg-amber-700 hover:shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
       <div className="text-center mt-4 text-gray-500">
         <p className="text-sm">Use arrow keys or buttons to navigate</p>
       </div>
    </div>
  );
};

export default InteractiveBook;

