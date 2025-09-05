import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react';

// Supabase will be imported dynamically inside the component

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
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        
        // --- SUPABASE SETUP ---
        const supabaseUrl = 'https://yrrxcjmnptbolmbmbqkw.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlycnhjam1ucHRib2xtYm1icWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzAxODMsImV4cCI6MjA3MDIwNjE4M30.YlMdd1S6s3--xv-qtuNe9aXBitJtxCo9AG3SkFPVrcU';
        
        if (supabaseUrl && supabaseKey) {
          setSupabase(createClient(supabaseUrl, supabaseKey));
        }
      } catch (error) {
        console.error("Error loading Supabase client:", error);
        setPdfError("Failed to load necessary components.");
      }
    };
    initSupabase();
  }, []); // Run only once on mount


  const pages: PageContent[] = [
    { id: 'page0', type: 'content', image: 'https://i.postimg.cc/Sj0ZNvbN/innovatex25-Recovered.jpg' },
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
      if (viewingPdf) return; // Don't flip pages if modal is open
      if (event.key === 'ArrowRight') nextPage();
      if (event.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, isFlipping, viewingPdf]);

  const getPageClass = (pageType: 'cover' | 'content' | 'back') => {
    switch(pageType) {
      case 'cover': return 'bg-gradient-to-br from-yellow-400 to-yellow-500';
      case 'back': return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      default: return 'bg-white';
    }
  }
  
  const handleViewPdf = () => {
    setPdfError(null);
    if (!supabase) {
      setPdfError("Supabase client is not yet initialized. Please wait a moment.");
      return;
    }
    // Assumes your bucket is named 'public-documents' and is public.
    const { data } = supabase
      .storage
      .from('public-documents') 
      .getPublicUrl('InnovateX25 Documentation.pdf');

    if (data.publicUrl) {
      setViewingPdf(data.publicUrl);
    } else {
      setPdfError("Could not retrieve PDF. Please check the file name and bucket permissions in Supabase.");
      console.error("Error getting public URL from Supabase.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div 
        ref={bookRef}
        className="relative"
        style={{ perspective: '1500px' }}
      >
        <div 
          className="relative w-80 h-[480px] md:w-96 md:h-[560px] transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0"
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
                 {page.image && (
                    <img 
                      src={page.image} 
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-cover" 
                    />
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
        {pdfError && <p className="text-red-500 mt-4 text-sm">{pdfError}</p>}
      </div>
       {/* --- PDF Viewer Modal --- */}
      <PDFViewerModal pdfUrl={viewingPdf} onClose={() => setViewingPdf(null)} />
    </div>
  );
};

export default InteractiveBook;

