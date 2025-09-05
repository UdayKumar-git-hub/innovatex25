import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Download, X } from 'lucide-react';

interface PageContent {
  id: string;
  type: 'cover' | 'content' | 'back';
  title?: string;
  subtitle?: string;
  image?: string;
  icon?: React.ReactNode;
}

// --- PDF Viewer Modal Component ---
const PDFViewerModal = ({ pdfUrl, onClose }) => {
  if (!pdfUrl) return null;

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-700">Document Viewer</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 p-1">
          <iframe src={pdfUrl} width="100%" height="100%" title="PDF Viewer" className="border-none rounded-b-lg"></iframe>
        </div>
      </div>
    </div>
  );
};


const InteractiveBook: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);

  // Updated book content to be image-focused
  const pages: PageContent[] = [
    { id: 'page0', type: 'content', image: 'https://i.postimg.cc/Sj0ZNvbN/innovatex25-Recovered.jpg' },
    
    // --- Content Pages with Images Only ---
    { id: 'page1', type: 'content', image: 'https://i.postimg.cc/VknxMXKV/price.jpg' },
    { id: 'page2', type: 'content', image: 'https://i.postimg.cc/vZrKDbBR/3rdpage.jpg' },
    { id: 'page3', type: 'content', image: 'https://i.postimg.cc/R0VzBNTp/ipl-poster-Copy.jpg' },
    { id: 'page4', type: 'content', image: 'https://i.postimg.cc/cJ9G409x/ipl-outcomesjpg.jpg' },
    { id: 'page5', type: 'content', image: 'https://i.postimg.cc/jShrmzyJ/brandbattlesposter.jpg' },
    { id: 'page6', type: 'content', image: 'https://i.postimg.cc/RZmBgPJB/brand-outcomes.jpg' },
    { id: 'page7', type: 'content', image: 'https://i.postimg.cc/NGyBF2vW/youngposter.jpg' },
    { id: 'page8', type: 'content', image: 'https://i.postimg.cc/PfBhwftN/youngoutcomes.jpg' },
    { id: 'page9', type: 'content', image: 'https://i.postimg.cc/J4Z8cwnx/echoes.jpg' },
    { id: 'page10', type: 'content', image: 'https://i.postimg.cc/sgd8Vv39/echoesfinal.jpg' },
    { id: 'page11', type: 'content', image: 'https://i.postimg.cc/cCt9WNjb/iternary.jpg' },
    { id: 'page12', type: 'content', image: 'https://i.postimg.cc/76WsjLBz/day1.jpg' },
    { id: 'page13', type: 'content', image: 'https://i.postimg.cc/NMMCNXxY/Day2.jpg' },
    { id: 'page14', type: 'content', image: 'https://i.postimg.cc/KYQsrfBJ/day3.jpg' },
    { id: 'page15', type: 'content', image: 'https://i.postimg.cc/nLnPDgjX/optional.jpg' },
    { id: 'page16', type: 'content', image: 'https://i.postimg.cc/SQP3vg5P/o-fund.jpg' },
    // --- Back Cover ---
    { id: 'page17', type: 'content', image: 'https://i.postimg.cc/VLbpQjPk/last.jpg' }
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
      case 'cover': return 'bg-gradient-to-br from-yellow-400 to-yellow-500';
      case 'back': return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      default: return 'bg-white';
    }
  }
  
  const handleViewPdf = () => {
    // URL-encode the filename to handle spaces and ensure it's a valid URL path
    const pdfFileName = "InnovateX25 Documentation.pdf";
    const pdfUrl = `/${encodeURIComponent(pdfFileName)}`;
    setViewingPdf(pdfUrl);
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
          <div className="absolute -left-6 top-0 w-6 h-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-l-md shadow-2xl transform -skew-y-1"></div>
          
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
          className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentPage ? 'bg-yellow-500 w-6' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage === pageCount - 1 || isFlipping}
          className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
       <div className="text-center mt-4 text-gray-500">
        <p className="text-sm">Use arrow keys or buttons to navigate</p>
       </div>

      {/* --- PDF Viewer Section --- */}
      <div className="w-full max-w-3xl mt-12 p-8 bg-white rounded-lg shadow-md text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Event Documentation</h3>
        <p className="text-gray-600 mb-6">For a detailed overview of the event, please view the official documentation PDF.</p>
        <div className="flex justify-center">
            <button
              onClick={handleViewPdf}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-lg"
            >
              <BookOpen className="w-6 h-6" />
              View Documentation
            </button>
        </div>
      </div>
       {/* --- PDF Viewer Modal --- */}
      <PDFViewerModal pdfUrl={viewingPdf} onClose={() => setViewingPdf(null)} />
    </div>
  );
};

export default InteractiveBook;

