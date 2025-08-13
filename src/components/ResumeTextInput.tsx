import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { ParsedResume } from '@/types/resume';
import { parseResumeText } from '@/utils/parseResumeText';
import { calculateResumeConfidence, getConfidenceMessage, getConfidenceColor } from '@/utils/resumeConfidence';

interface ResumeTextInputProps {
  onResumeProcessed: (resume: ParsedResume) => void;
  className?: string;
}

export function ResumeTextInput({ onResumeProcessed, className }: ResumeTextInputProps) {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);

  const processText = async () => {
    if (!text.trim()) {
      setError('Please enter your resume text');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('🔤 Processing pasted resume text, length:', text.length);
      const parsed = parseResumeText(text);
      setParsedResume(parsed);
      onResumeProcessed(parsed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process resume text';
      setError(errorMessage);
      console.error('❌ Resume text processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearText = () => {
    setText('');
    setParsedResume(null);
    setError(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Paste Resume Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!parsedResume && (
          <>
            <Textarea
              placeholder="Paste your resume text here... (Copy from your resume document and paste here for best results)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex items-center gap-2">
              <Button 
                onClick={processText} 
                disabled={!text.trim() || isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Process Resume
                  </>
                )}
              </Button>
              {text && (
                <Button variant="outline" onClick={clearText}>
                  Clear
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Characters: {text.length} | Recommended: 500+ characters for accurate parsing
            </p>
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {parsedResume && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Resume processed successfully!
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900">✅ Using YOUR Resume Data</div>
              <div className="text-xs text-blue-700 mt-1">
                Not demo data - this analysis will be based on your actual resume
              </div>
              <div className={`text-xs mt-1 ${getConfidenceColor(calculateResumeConfidence(parsedResume))}`}>
                Parsing confidence: {calculateResumeConfidence(parsedResume)}% - {getConfidenceMessage(calculateResumeConfidence(parsedResume))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg text-sm">
              <div>
                <span className="font-medium">Name:</span> {parsedResume.personalInfo.name || 'Not detected'}
              </div>
              <div>
                <span className="font-medium">Experience:</span> {parsedResume.totalExperience} years
              </div>
              <div>
                <span className="font-medium">Skills:</span> {parsedResume.skills.length} identified
              </div>
              <div>
                <span className="font-medium">Jobs:</span> {parsedResume.experience.length} positions
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Detected Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {parsedResume.skills.slice(0, 10).map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                  >
                    {skill.name} ({skill.category})
                  </span>
                ))}
                {parsedResume.skills.length > 10 && (
                  <span className="text-sm text-muted-foreground">
                    +{parsedResume.skills.length - 10} more
                  </span>
                )}
              </div>
            </div>

            <Button onClick={clearText} variant="outline" size="sm">
              Process Different Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

