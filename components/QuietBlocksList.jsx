'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, Trash2, BookOpen } from 'lucide-react';

export function QuietBlocksList({ refreshTrigger }) {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiet-blocks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlocks(data.blocks);
      }
    } catch (error) {
      console.error('Failed to fetch blocks:', error);
    }
    setIsLoading(false);
  };

  const deleteBlock = async (blockId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quiet-blocks/${blockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBlocks(blocks.filter(block => block._id !== blockId));
      }
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, [refreshTrigger]);

  const getBlockStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      const minutesUntil = Math.floor((start.getTime() - now.getTime()) / (1000 * 60));
      if (minutesUntil <= 10) {
        return { status: 'starting-soon', label: 'Starting Soon', color: 'bg-orange-100 text-orange-800' };
      }
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= start && now <= end) {
      return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center text-gray-600">Loading your quiet blocks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
          <Calendar className="w-5 h-5 text-blue-500" />
          Your Quiet Blocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>No quiet blocks scheduled yet.</p>
            <p className="text-sm">Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => {
              const { status, label, color } = getBlockStatus(block.startTime, block.endTime);
              
              return (
                <div
                  key={block._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{block.title}</h3>
                        <Badge className={`${color} border-0`}>
                          {label}
                        </Badge>
                      </div>
                      
                      {block.description && (
                        <p className="text-gray-600 text-sm mb-3">{block.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(block.startTime), 'MMM dd, yyyy h:mm a')}
                        </div>
                        <span>→</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(block.endTime), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBlock(block._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}