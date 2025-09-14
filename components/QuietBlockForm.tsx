'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Clock } from 'lucide-react';

interface QuietBlockFormProps {
  onSuccess: () => void;
}

export function QuietBlockForm({ onSuccess }: QuietBlockFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (startDate >= endDate) {
      setError('End time must be after start time');
      setIsLoading(false);
      return;
    }

    if (startDate < new Date()) {
      setError('Start time must be in the future');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiet-blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create quiet block');
      }
    } catch {
      setError('Failed to create quiet block');
    }

    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
          <Plus className="w-5 h-5 text-blue-500" />
          Schedule New Quiet Block
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Session Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Deep Work Session, Study Time"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="What will you be working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-gray-200 min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-gray-700 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-gray-700 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-gray-200"
              />
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Schedule Quiet Block'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}