import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from '../components/routes/ProtectedRoute';
import { PublicOnlyRoute } from '../components/routes/PublicOnlyRoute';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoadingSpinner } from '../components/LoadingSpinner';

const DashboardPage = React.lazy(() => import('../pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const CommunicationPage = React.lazy(() => import('../pages/CommunicationPage').then(module => ({ default: module.CommunicationPage })));
const FluencyPage = React.lazy(() => import('../pages/FluencyPage').then(module => ({ default: module.FluencyPage })));
const FormalCommunicationPage = React.lazy(() => import('../pages/FormalCommunicationPage').then(module => ({ default: module.FormalCommunicationPage })));
const SituationalCommunicationPage = React.lazy(() => import('../pages/SituationalCommunicationPage').then(module => ({ default: module.SituationalCommunicationPage })));
const GroupDiscussionPage = React.lazy(() => import('../pages/GroupDiscussionPage').then(module => ({ default: module.GroupDiscussionPage })));
const AptitudePage = React.lazy(() => import('../pages/AptitudePage').then(module => ({ default: module.AptitudePage })));
const QuantitativePage = React.lazy(() => import('../pages/QuantitativePage').then(module => ({ default: module.QuantitativePage })));
const VerbalPage = React.lazy(() => import('../pages/VerbalPage').then(module => ({ default: module.VerbalPage })));
const LogicalPage = React.lazy(() => import('../pages/LogicalPage').then(module => ({ default: module.LogicalPage })));
const PuzzleListPage = React.lazy(() => import('../pages/puzzles/PuzzleListPage').then(module => ({ default: module.PuzzleListPage })));
const PuzzleWorkspacePage = React.lazy(() => import('../pages/puzzles/PuzzleWorkspacePage').then(module => ({ default: module.PuzzleWorkspacePage })));
const TechnicalDashboardPage = React.lazy(() => import('../pages/technical/TechnicalDashboardPage').then(module => ({ default: module.TechnicalDashboardPage })));
const TechnicalLanguagePage = React.lazy(() => import('../pages/technical/TechnicalLanguagePage').then(module => ({ default: module.TechnicalLanguagePage })));
const TechnicalTopicPage = React.lazy(() => import('../pages/technical/TechnicalTopicPage').then(module => ({ default: module.TechnicalTopicPage })));
const TechnicalSessionPage = React.lazy(() => import('../pages/technical/TechnicalSessionPage').then(module => ({ default: module.TechnicalSessionPage })));
const CProgrammingPage = React.lazy(() => import('../pages/technical/c/CProgrammingPage').then(module => ({ default: module.CProgrammingPage })));
const CPracticePage = React.lazy(() => import('../pages/technical/c/CPracticePage').then(module => ({ default: module.CPracticePage })));
const CSessionPage = React.lazy(() => import('../pages/technical/c/CSessionPage').then(module => ({ default: module.CSessionPage })));
const CResultPage = React.lazy(() => import('../pages/technical/c/CResultPage').then(module => ({ default: module.CResultPage })));
const CppProgrammingPage = React.lazy(() => import('../pages/technical/cpp/CppProgrammingPage').then(module => ({ default: module.CppProgrammingPage })));
const CppPracticePage = React.lazy(() => import('../pages/technical/cpp/CppPracticePage').then(module => ({ default: module.CppPracticePage })));
const CppSessionPage = React.lazy(() => import('../pages/technical/cpp/CppSessionPage').then(module => ({ default: module.CppSessionPage })));
const CppResultPage = React.lazy(() => import('../pages/technical/cpp/CppResultPage').then(module => ({ default: module.CppResultPage })));
const JavaProgrammingPage = React.lazy(() => import('../pages/technical/java/JavaProgrammingPage').then(module => ({ default: module.JavaProgrammingPage })));
const JavaPracticePage = React.lazy(() => import('../pages/technical/java/JavaPracticePage').then(module => ({ default: module.JavaPracticePage })));
const JavaSessionPage = React.lazy(() => import('../pages/technical/java/JavaSessionPage').then(module => ({ default: module.JavaSessionPage })));
const JavaResultPage = React.lazy(() => import('../pages/technical/java/JavaResultPage').then(module => ({ default: module.JavaResultPage })));
const PythonProgrammingPage = React.lazy(() => import('../pages/technical/python/PythonProgrammingPage').then(module => ({ default: module.PythonProgrammingPage })));
const PythonPracticePage = React.lazy(() => import('../pages/technical/python/PythonPracticePage').then(module => ({ default: module.PythonPracticePage })));
const PythonSessionPage = React.lazy(() => import('../pages/technical/python/PythonSessionPage').then(module => ({ default: module.PythonSessionPage })));
const PythonResultPage = React.lazy(() => import('../pages/technical/python/PythonResultPage').then(module => ({ default: module.PythonResultPage })));
const CSCorePage = React.lazy(() => import('../pages/technical/cs-core/CSCorePage').then(module => ({ default: module.CSCorePage })));
const CSSubjectPage = React.lazy(() => import('../pages/technical/cs-core/CSSubjectPage').then(module => ({ default: module.CSSubjectPage })));
const CSPracticePage = React.lazy(() => import('../pages/technical/cs-core/CSPracticePage').then(module => ({ default: module.CSPracticePage })));
const CSSessionPage = React.lazy(() => import('../pages/technical/cs-core/CSSessionPage').then(module => ({ default: module.CSSessionPage })));
const CSResultPage = React.lazy(() => import('../pages/technical/cs-core/CSResultPage').then(module => ({ default: module.CSResultPage })));
const AssessmentLandingPage = React.lazy(() => import('../pages/assessments/AssessmentLandingPage').then(module => ({ default: module.AssessmentLandingPage })));
const AssessmentDetailsPage = React.lazy(() => import('../pages/assessments/AssessmentDetailsPage').then(module => ({ default: module.AssessmentDetailsPage })));
const AssessmentSessionPage = React.lazy(() => import('../pages/assessments/AssessmentSessionPage').then(module => ({ default: module.AssessmentSessionPage })));
const AssessmentResultPage = React.lazy(() => import('../pages/assessments/AssessmentResultPage').then(module => ({ default: module.AssessmentResultPage })));
const AssessmentReviewPage = React.lazy(() => import('../pages/assessments/AssessmentReviewPage').then(module => ({ default: module.AssessmentReviewPage })));
const AssessmentHistoryPage = React.lazy(() => import('../pages/assessments/AssessmentHistoryPage').then(module => ({ default: module.AssessmentHistoryPage })));
const InterviewLandingPage = React.lazy(() => import('../pages/interview/InterviewLandingPage').then(module => ({ default: module.InterviewLandingPage })));
const InterviewSessionPage = React.lazy(() => import('../pages/interview/InterviewSessionPage').then(module => ({ default: module.InterviewSessionPage })));
const MockInterviewPage = React.lazy(() => import('../pages/MockInterviewPage').then(module => ({ default: module.MockInterviewPage })));
const LeaderboardPage = React.lazy(() => import('../pages/LeaderboardPage').then(module => ({ default: module.LeaderboardPage })));
const PlacementLandingPage = React.lazy(() => import('../pages/placement/PlacementLandingPage').then(module => ({ default: module.PlacementLandingPage })));
const PlacementSessionPage = React.lazy(() => import('../pages/placement/PlacementSessionPage').then(module => ({ default: module.PlacementSessionPage })));
const SimulationSummaryPage = React.lazy(() => import('../pages/placement/SimulationSummaryPage').then(module => ({ default: module.SimulationSummaryPage })));
const SimulationHistoryPage = React.lazy(() => import('../pages/placement/SimulationHistoryPage').then(module => ({ default: module.SimulationHistoryPage })));
const InterviewResultPage = React.lazy(() => import('../pages/interview/InterviewResultPage').then(module => ({ default: module.InterviewResultPage })));
const InterviewHistoryPage = React.lazy(() => import('../pages/interview/InterviewHistoryPage').then(module => ({ default: module.InterviewHistoryPage })));
const ResumeCenterPage = React.lazy(() => import('../pages/resume/ResumeCenterPage').then(module => ({ default: module.ResumeCenterPage })));
const ResumeUploadPage = React.lazy(() => import('../pages/resume/ResumeUploadPage').then(module => ({ default: module.ResumeUploadPage })));
const ResumeDetailsPage = React.lazy(() => import('../pages/resume/ResumeDetailsPage').then(module => ({ default: module.ResumeDetailsPage })));
const ResumeHistoryPage = React.lazy(() => import('../pages/resume/ResumeHistoryPage').then(module => ({ default: module.ResumeHistoryPage })));
const ResumeImprovementOverview = React.lazy(() => import('../pages/resume/ResumeImprovementOverview').then(module => ({ default: module.ResumeImprovementOverview })));
const ResumeImprovementSessionPage = React.lazy(() => import('../pages/resume/ResumeImprovementSessionPage').then(module => ({ default: module.ResumeImprovementSessionPage })));
const ResumeImprovementHistoryPage = React.lazy(() => import('../pages/resume/ResumeImprovementHistoryPage').then(module => ({ default: module.ResumeImprovementHistoryPage })));
const StudentAnalyticsOverviewPage = React.lazy(() => import('../pages/analytics/StudentAnalyticsOverviewPage').then(module => ({ default: module.StudentAnalyticsOverviewPage })));
const CategoryAnalyticsPage = React.lazy(() => import('../pages/analytics/CategoryAnalyticsPage').then(module => ({ default: module.CategoryAnalyticsPage })));
const RecommendationsPage = React.lazy(() => import('../pages/recommendations/RecommendationsPage').then(module => ({ default: module.RecommendationsPage })));
const RecommendationHistoryPage = React.lazy(() => import('../pages/recommendations/RecommendationHistoryPage').then(module => ({ default: module.RecommendationHistoryPage })));
const CompetitionsPage = React.lazy(() => import('../pages/competitions/CompetitionsPage').then(module => ({ default: module.CompetitionsPage })));
const CompetitionDetailsPage = React.lazy(() => import('../pages/competitions/CompetitionDetailsPage').then(module => ({ default: module.CompetitionDetailsPage })));
const CompetitionParticipationPage = React.lazy(() => import('../pages/competitions/CompetitionParticipationPage').then(module => ({ default: module.CompetitionParticipationPage })));
const CompetitionResultPage = React.lazy(() => import('../pages/competitions/CompetitionResultPage').then(module => ({ default: module.CompetitionResultPage })));
const CompetitionLeaderboardPage = React.lazy(() => import('../pages/competitions/CompetitionLeaderboardPage').then(module => ({ default: module.CompetitionLeaderboardPage })));
const CompetitionHistoryPage = React.lazy(() => import('../pages/competitions/CompetitionHistoryPage').then(module => ({ default: module.CompetitionHistoryPage })));
const AdminLayout = React.lazy(() => import('../components/admin/AdminLayout'));
const AdminRoute = React.lazy(() => import('../components/admin/AdminRoute'));
const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminStudentsPage = React.lazy(() => import('../pages/admin/AdminStudentsPage'));
const AdminCompetitionsPage = React.lazy(() => import('../pages/admin/AdminCompetitionsPage'));
const AdminContentPage = React.lazy(() => import('../pages/admin/AdminContentPage'));
const AdminActivityPage = React.lazy(() => import('../pages/admin/AdminActivityPage'));
const AccessDeniedPage = React.lazy(() => import('../pages/admin/AccessDeniedPage'));

const PageSuspenseFallback = () => (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
    <LoadingSpinner message="Loading ARENA..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Landing Page */}
        <Route index element={<LandingPage />} />

        {/* Public-Only Auth Routes (Redirects to /dashboard if logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected Student Routes (Requires Authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="communication" element={<CommunicationPage />} />
          <Route path="communication/fluency" element={<FluencyPage />} />
          <Route path="communication/formal" element={<FormalCommunicationPage />} />
          <Route path="communication/situational" element={<SituationalCommunicationPage />} />
          <Route path="communication/group-discussion" element={<GroupDiscussionPage />} />
          <Route path="aptitude" element={<AptitudePage />} />
          <Route path="aptitude/quantitative" element={<QuantitativePage />} />
          <Route path="aptitude/verbal" element={<VerbalPage />} />
          <Route path="aptitude/logical" element={<LogicalPage />} />
          <Route path="puzzles" element={<PuzzleListPage />} />
          <Route path="puzzles/:problemId" element={<PuzzleWorkspacePage />} />
          <Route path="technical" element={<TechnicalDashboardPage />} />
          <Route path="technical/c" element={<CProgrammingPage />} />
          <Route path="technical/c/result" element={<CResultPage />} />
          <Route path="technical/c/:topicId" element={<CPracticePage />} />
          <Route path="technical/c/session/:sessionId" element={<CSessionPage />} />
          <Route path="technical/cpp" element={<CppProgrammingPage />} />
          <Route path="technical/cpp/result" element={<CppResultPage />} />
          <Route path="technical/cpp/:topicId" element={<CppPracticePage />} />
          <Route path="technical/cpp/session/:sessionId" element={<CppSessionPage />} />
          <Route path="technical/java" element={<JavaProgrammingPage />} />
          <Route path="technical/java/result" element={<JavaResultPage />} />
          <Route path="technical/java/:topicId" element={<JavaPracticePage />} />
          <Route path="technical/java/session/:sessionId" element={<JavaSessionPage />} />
          <Route path="technical/python" element={<PythonProgrammingPage />} />
          <Route path="technical/python/result" element={<PythonResultPage />} />
          <Route path="technical/python/:topicId" element={<PythonPracticePage />} />
          <Route path="technical/python/session/:sessionId" element={<PythonSessionPage />} />
          <Route path="technical/cs-core" element={<CSCorePage />} />
          <Route path="technical/cs-core/result" element={<CSResultPage />} />
          <Route path="technical/cs-core/:subjectId" element={<CSSubjectPage />} />
          <Route path="technical/cs-core/:subjectId/:topicId" element={<CSPracticePage />} />
          <Route path="technical/cs-core/session/:sessionId" element={<CSSessionPage />} />
          <Route path="technical/:language" element={<TechnicalLanguagePage />} />
          <Route path="technical/:language/:topicId" element={<TechnicalTopicPage />} />
          <Route path="technical/session/:sessionId" element={<TechnicalSessionPage />} />
          
          <Route path="assessments" element={<AssessmentLandingPage />} />
          <Route path="assessments/history" element={<AssessmentHistoryPage />} />
          <Route path="assessments/:assessmentId" element={<AssessmentDetailsPage />} />
          <Route path="assessments/:assessmentId/session/:sessionId" element={<AssessmentSessionPage />} />
          <Route path="assessments/results/:resultId" element={<AssessmentResultPage />} />
          <Route path="assessments/results/:resultId/review" element={<AssessmentReviewPage />} />
          
          <Route path="interview" element={<InterviewLandingPage />} />
          <Route path="interview/session/:sessionId" element={<InterviewSessionPage />} />
          <Route path="interview/results/:resultId" element={<InterviewResultPage />} />
          <Route path="interview/history" element={<InterviewHistoryPage />} />

          <Route path="mock-interview" element={<MockInterviewPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          
          <Route path="resume" element={<ResumeCenterPage />} />
          <Route path="resume/upload" element={<ResumeUploadPage />} />
          <Route path="resume/history" element={<ResumeHistoryPage />} />
          <Route path="resume/:resumeId" element={<ResumeDetailsPage />} />
          
          <Route path="resume/improve" element={<ResumeImprovementOverview />} />
          <Route path="resume/:resumeId/improve" element={<ResumeImprovementOverview />} />
          <Route path="resume/improvement/history" element={<ResumeImprovementHistoryPage />} />
          <Route path="resume/improvement/:sessionId" element={<ResumeImprovementSessionPage />} />

          {/* Student Analytics Routes */}
          <Route path="analytics" element={<StudentAnalyticsOverviewPage />} />
          <Route path="analytics/:categoryId" element={<CategoryAnalyticsPage />} />

          {/* Recommendations Routes */}
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="recommendations/history" element={<RecommendationHistoryPage />} />

          {/* Competitions Routes */}
          <Route path="competitions" element={<CompetitionsPage />} />
          <Route path="competitions/history" element={<CompetitionHistoryPage />} />
          <Route path="competitions/:competitionId" element={<CompetitionDetailsPage />} />
          <Route path="competitions/:competitionId/participate" element={<CompetitionParticipationPage />} />
          <Route path="competitions/:competitionId/result" element={<CompetitionResultPage />} />
          <Route path="competitions/:competitionId/leaderboard" element={<CompetitionLeaderboardPage />} />

          {/* Placement Simulation Routes */}
          <Route path="placement" element={<PlacementLandingPage />} />
          <Route path="placement/history" element={<SimulationHistoryPage />} />
          <Route path="placement/sessions/:sessionId" element={<PlacementSessionPage />} />
          <Route path="placement/sessions/:sessionId/summary" element={<SimulationSummaryPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes (Outside MainLayout) */}
      <Route path="/admin/access-denied" element={<AccessDeniedPage />} />
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/competitions" element={<AdminCompetitionsPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/activity" element={<AdminActivityPage />} />
        </Route>
      </Route>
    </Routes>
    </Suspense>
  );
};
