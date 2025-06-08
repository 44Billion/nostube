import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function CollapsibleText({ text, maxLines = 5, className }: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const height = textRef.current.scrollHeight;
      const lines = height / lineHeight;
      setShowButton(lines > maxLines);
    }
  }, [text, maxLines]);

  return (
    <div className={className}>
      <p
        ref={textRef}
        className={cn(
          "whitespace-pre-wrap",
          !isExpanded && "line-clamp-5"
        )}
      >
        {text}
      </p>
      {showButton && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-8 px-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show more
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
} 