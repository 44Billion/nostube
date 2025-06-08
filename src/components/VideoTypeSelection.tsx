import { Button } from '@/components/ui/button';

type VideoType = 'all' | 'shorts' | 'videos';

interface VideoTypeSelectionProps {
  selectedType: VideoType;
  onTypeChange: (type: VideoType) => void;
}

export function VideoTypeSelection({ selectedType, onTypeChange }: VideoTypeSelectionProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={selectedType === 'all' ? 'default' : 'outline'}
        onClick={() => onTypeChange('all')}
      >
        All
      </Button>
      <Button
        variant={selectedType === 'shorts' ? 'default' : 'outline'}
        onClick={() => onTypeChange('shorts')}
      >
        Shorts
      </Button>
      <Button
        variant={selectedType === 'videos' ? 'default' : 'outline'}
        onClick={() => onTypeChange('videos')}
      >
        Videos
      </Button>
    </div>
  );
} 