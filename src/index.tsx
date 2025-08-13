import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileText, BarChart3, Target, Users, TrendingUp, Upload } from 'lucide-react';
import { ResumeUpload } from '@/components/ResumeUpload';
import { ProfilePreview } from '@/components/ProfilePreview';
import { DebugProfileDisplay } from '@/components/DebugProfileDisplay';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import CompanyResearchCard from '@/components/CompanyResearchCard';
import JobMatchDashboard from '@/components/JobMatchDashboard';
import type { JobDescription, CompanyProfile, JobMatchAnalysis } from '@/types/job';
import type { ParsedResume } from '@/types/resume';
import type { UserProfile } from '@/utils/jobMatcher';
import { analyzeJobMatch } from '@/utils/jobMatcher';
import { generateUserProfile } from '@/utils/profileGenerator';
import { mockParsedResume, mockJobDescriptions, mockCompanyProfile } from '@/utils/mockResumeData';
import { calculateResumeConfidence, getConfidenceMessage, getConfidenceColor } from '@/utils/resumeConfidence';

export default function Index() {
  const [activeTab, setActiveTab] = useState('resume');
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [dataSource, setDataSource] = useState<'user' | 'mock' | null>(null);

  const handleResumeProcessed = (resume: ParsedResume) => {
    console.log("📄 Resume processed in main component:", resume);
    
    // Validate resume confidence
    const confidence = calculateResumeConfidence(resume);
    console.log("📊 Resume confidence score:", confidence);
    
    if (confidence < 50) {
      console.warn("⚠️ LOW CONFIDENCE RESUME - extracted limited data");
    }
    
    setParsedResume(resume);
    setDataSource('user');
    
    console.log("🔄 Generating user profile...");
    const profile = generateUserProfile(resume);
    console.log("👤 Generated profile:", profile);
    
    setUserProfile(profile);
    setActiveTab('job');
    
    console.log("✅ Resume processing complete, profile set, moved to job tab");
  };

  const handleJobSubmit = (job: JobDescription) => {
    console.log("🎯 Job submitted to parent component:", job);
    setJobDescription(job);
    console.log("📋 Job description state updated, tabs should now be enabled");
    // Don't auto-navigate, let user review and manually continue
  };

  const handleCompanyResearch = (company: CompanyProfile) => {
    setCompanyProfile(company);
    // Don't auto-trigger analysis, let user manually proceed
  };

  const handleAnalysisRequest = () => {
    if (jobDescription && userProfile) {
      const result = analyzeJobMatch(userProfile, jobDescription, companyProfile);
      setAnalysis(result);
      setActiveTab('analysis');
    }
  };

  const loadMockData = () => {
    console.log("🎭 Loading DEMO data...");
    
    // Load mock resume and generate profile
    setParsedResume(mockParsedResume);
    setDataSource('mock');
    const profile = generateUserProfile(mockParsedResume);
    setUserProfile(profile);
    
    // Load mock job description
    setJobDescription(mockJobDescriptions.seniorFrontend);
    
    // Load mock company profile
    setCompanyProfile(mockCompanyProfile);
    
    // Generate analysis
    const result = analyzeJobMatch(profile, mockJobDescriptions.seniorFrontend, mockCompanyProfile);
    setAnalysis(result);
    
    console.log('✅ DEMO data loaded successfully:', {
      resume: mockParsedResume,
      profile: {
        name: profile.name,
        skillCount: Object.keys(profile.skills).length,
        experience: profile.experience
      },
      job: mockJobDescriptions.seniorFrontend.title,
      company: mockCompanyProfile.name,
      analysisScore: result.overallScore
    });
    
    // Show user which data source is active
    console.log("📊 Using DEMO DATA - skills:", Object.keys(profile.skills).slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Job Application Optimizer</h1>
            <p className="text-muted-foreground mt-2">
              Upload your resume, analyze job opportunities, and get personalized recommendations
            </p>
            <Button 
              onClick={loadMockData} 
              variant="destructive" 
              size="sm" 
              className="mt-3"
            >
              🎭 Load Demo Data (Fake Profile)
            </Button>
          </div>
          <div className="text-right space-y-1">
            {parsedResume && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  ✓ Resume: {parsedResume.personalInfo.name}
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  dataSource === 'mock' 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {dataSource === 'mock' ? '🎭 DEMO DATA' : '👤 YOUR RESUME'}
                </div>
                {dataSource === 'user' && (
                  <div className="text-xs text-muted-foreground">
                    Confidence: {calculateResumeConfidence(parsedResume)}%
                  </div>
                )}
              </div>
            )}
            {jobDescription && (
              <div>
                <div className="font-semibold">{jobDescription.title}</div>
                <div className="text-sm text-muted-foreground">{jobDescription.company}</div>
                <Badge variant="outline" className="mt-1">
                  {jobDescription.level}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Resume Upload
            </TabsTrigger>
            <TabsTrigger value="job" className="flex items-center gap-2" disabled={!parsedResume}>
              <FileText className="h-4 w-4" />
              Job Analysis
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2" disabled={!jobDescription}>
              <Building2 className="h-4 w-4" />
              Company Research
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2" disabled={!userProfile || !jobDescription}>
              <BarChart3 className="h-4 w-4" />
              Match Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="space-y-6">
            <ResumeUpload onResumeProcessed={handleResumeProcessed} />
            {parsedResume && userProfile && (
              <>
                <ProfilePreview 
                  parsedResume={parsedResume} 
                  userProfile={userProfile}
                />
                <DebugProfileDisplay
                  parsedResume={parsedResume}
                  userProfile={userProfile}
                  isVisible={showDebug}
                  onToggleVisibility={() => setShowDebug(!showDebug)}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="job" className="space-y-6">
            <JobDescriptionInput onSubmit={handleJobSubmit} initialJob={jobDescription} />
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <CompanyResearchCard onResearchComplete={handleCompanyResearch} initialCompany={companyProfile} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {analysis ? (
              <JobMatchDashboard analysis={analysis} />
            ) : (
              <div>
                <p className="text-muted-foreground">No analysis available. Please submit a job description and company profile.</p>
                <Button onClick={handleAnalysisRequest} disabled={!userProfile || !jobDescription}>
                  Analyze Match
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

