'use client';

import { useRef, useState, useTransition } from 'react';
import type { Build, Comment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { likeBuild, commentOnBuild } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BuildInteractions({ build }: { build: Build }) {
  const { toast } = useToast();
  const [isLiking, startLikeTransition] = useTransition();
  const [isCommenting, startCommentTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticLikes, setOptimisticLikes] = useState(build.likes);
  const [optimisticComments, setOptimisticComments] = useState(build.comments);

  const handleLike = () => {
    startLikeTransition(async () => {
      setOptimisticLikes((p) => p + 1);
      try {
        await likeBuild(build.id);
      } catch (error) {
        setOptimisticLikes((p) => p - 1);
        toast({
          title: 'Error',
          description: 'Failed to like build.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleCommentSubmit = async (formData: FormData) => {
    const author = formData.get('author') as string;
    const comment = formData.get('comment') as string;

    if (!author || !comment || author.length < 2 || comment.length < 3) {
      toast({
        title: 'Invalid Input',
        description: 'Please provide a valid name and comment.',
        variant: 'destructive',
      });
      return;
    }

    const newComment: Comment = {
      id: 'optimistic-comment-' + Date.now(),
      author,
      text: comment,
      createdAt: new Date(),
    };
    
    startCommentTransition(async () => {
      setOptimisticComments(prev => [newComment, ...prev]);
      formRef.current?.reset();
      try {
        await commentOnBuild(build.id, formData);
      } catch (error) {
        toast({
          title: 'Error Submitting Comment',
          description: (error as Error).message,
          variant: 'destructive',
        });
        setOptimisticComments(prev => prev.filter(c => c.id !== newComment.id));
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Did you like this build?</p>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLike}
              disabled={isLiking}
              className="group"
            >
              <Heart
                className={cn(
                  'mr-2 h-5 w-5 transition-all',
                  optimisticLikes > build.likes
                    ? 'text-red-500 fill-red-500'
                    : 'group-hover:text-red-500 group-hover:fill-red-500'
                )}
              />
              <span className="font-semibold">{optimisticLikes}</span>
              <span className="sr-only">Likes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            <span>Comments ({optimisticComments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={handleCommentSubmit} ref={formRef} className="space-y-4">
            <Input
              name="author"
              placeholder="Your name"
              required
              minLength={2}
            />
            <Textarea
              name="comment"
              placeholder="Write a comment..."
              required
              minLength={3}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={isCommenting}>
              {isCommenting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
          <Separator />
          <div className="space-y-6">
            {optimisticComments.map((comment, index) => (
              <div key={comment.id} className="flex gap-4">
                 <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/40?u=${comment.author}`} />
                  <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-foreground/80 mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
            {optimisticComments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Be the first to comment!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
