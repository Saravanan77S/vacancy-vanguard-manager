
import { Briefcase, Clock, Users } from "lucide-react";
import { getAllJobs, getActiveJobs, getMockApplicantsForJob } from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const allJobs = getAllJobs();
  const activeJobs = getActiveJobs();
  
  // Get applicants from the 5 most recent jobs
  const recentJobs = [...allJobs].sort((a, b) => 
    b.postedDate.getTime() - a.postedDate.getTime()
  ).slice(0, 5);
  
  const recentApplications = recentJobs.flatMap(job => 
    getMockApplicantsForJob(job.id)
  ).sort((a, b) => 
    b.appliedDate.getTime() - a.appliedDate.getTime()
  ).slice(0, 5);

  // Calculate total applicants
  const totalApplicants = allJobs.reduce((sum, job) => sum + job.applicantsCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Job Postings"
          value={allJobs.length}
          icon={Briefcase}
          description="All job postings"
          onClick={() => navigate("/jobs")}
        />
        <StatCard
          title="Active Jobs"
          value={activeJobs.length}
          icon={Clock}
          description="Currently accepting applications"
          trend={{ value: 12, isPositive: true }}
          onClick={() => navigate("/active-jobs")}
        />
        <StatCard
          title="Total Applicants"
          value={totalApplicants}
          icon={Users}
          description="Across all job postings"
          trend={{ value: 8, isPositive: true }}
          onClick={() => navigate("/applications")}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingDeadlines jobs={allJobs} />
        <RecentApplications applications={recentApplications} />
      </div>
    </div>
  );
};

export default Dashboard;
