import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { BottomNav } from '@/components/ui/Navigation';
import ScrollToTop from '@/components/ui/ScrollToTop';

export const RootLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col transition-colors duration-300 relative pb-16 md:pb-0 overflow-x-hidden">
      <ScrollToTop />
      {/* Background Radial Glow & Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-[600px] radial-overlay pointer-events-none z-0 opacity-80" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-accent/[0.03] blur-[160px] pointer-events-none z-0" />

      {/* Premium Desktop Navigation */}
      <Navbar />

      {/* Main Content — animated page transitions */}
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Reusable Footer Component */}
      <Footer />
    </div>
  );
};

export default RootLayout;
