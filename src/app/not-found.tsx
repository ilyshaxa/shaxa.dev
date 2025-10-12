'use client';

import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <h1 className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-primary dark:via-secondary dark:to-accent bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-gradient">Page Not Found</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you&apos;re looking for seems to have vanished into the digital void. 
            Don&apos;t worry, even the best DevOps engineers encounter 404s sometimes!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            asChild
            size="lg"
            variant="glass"
            className="group"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="group"
          >
            <Link href="/projects" className="flex items-center gap-2">
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Browse Projects
            </Link>
          </Button>
        </motion.div>

        {/* Fun DevOps Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 p-6 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-lg"
        >
          <p className="text-sm text-foreground">
            💡 <strong className="text-primary">Pro Tip:</strong> This 404 page is deployed with zero-downtime CI/CD pipelines. 
            Even this error page follows DevOps best practices! 
          </p>
        </motion.div>

      </div>
    </div>
  );
}
