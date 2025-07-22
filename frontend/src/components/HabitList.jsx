import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HabitItem from 'components/HabitItem';
import "../styles/habits.css";

const HabitList = ({ habits, loading, onDelete }) => {
  // Show loading skeleton while fetching data
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm"
          >
            {/* Loading skeleton structure */}
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Show empty state when no habits are found
  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          {/* Empty state illustration */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              🎯
            </motion.div>
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No habits found
          </h3>
          <p className="text-muted-foreground mb-6">
            Start building better habits by creating your first one!
          </p>
          
          {/* Motivational message */}
          <div className="bg-secondary/50 border border-border rounded-lg p-4">
            <p className="text-sm text-secondary-foreground">
              💡 <strong>Tip:</strong> Start small with one habit you can do in 2 minutes or less.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render the list of habits
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              y: -20,
              transition: { duration: 0.2 }
            }}
            whileHover={{ 
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            <HabitItem 
              habit={habit} 
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HabitList;