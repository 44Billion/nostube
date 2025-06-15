import { useVideoCache } from '@/contexts/VideoCacheContext';
import { Loader2 } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { VideoGrid } from '@/components/VideoGrid';
import { useEffect } from 'react';

export function ShortsPage() {
  const { config } = useAppContext();
  const { 
    videos,  
    isLoading, 
    hasMore,
    totalVideos,
    loadMoreRef,
    setVideoType,
    initSearch,
    setFollowedPubkeys,
    setLikedVideoIds
  } = useVideoCache();

  useEffect(() => {
    setVideoType('shorts');
    setFollowedPubkeys([]);
    setLikedVideoIds([]);
    initSearch();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {totalVideos} videos loaded
        </div>
      </div>

      <VideoGrid 
        videos={videos} 
        videoType={'shorts'} 
        isLoading={isLoading} 
        showSkeletons={true} 
      />

      <div 
        ref={loadMoreRef} 
        className="w-full py-8 flex items-center justify-center"
      >
        {hasMore && (videos.length > 0) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more videos...
          </div>
        )}
      </div>
    </div>
  );
}