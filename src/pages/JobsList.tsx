
import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Filter, Plus, Search } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job, JobStatus, getAllJobs } from "@/lib/mock-data";

const JobsList = () => {
  const allJobs = getAllJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");

  // Filter jobs based on search query and filters
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Group jobs by status
  const groupedJobs = {
    all: filteredJobs,
    published: filteredJobs.filter(job => job.status === "Published"),
    draft: filteredJobs.filter(job => job.status === "Draft"),
    closed: filteredJobs.filter(job => job.status === "Closed"),
    filled: filteredJobs.filter(job => job.status === "Filled"),
  };

  // Get unique categories from jobs
  const categories = Array.from(new Set(allJobs.map(job => job.category)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Listings</h1>
          <p className="text-muted-foreground">
            Manage all your job vacancies in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/create-job">
            <Plus className="mr-2 h-4 w-4" />
            Create New Job
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Filled">Filled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All <Badge variant="outline" className="ml-2">{groupedJobs.all.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="published">
            Published <Badge variant="outline" className="ml-2">{groupedJobs.published.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft <Badge variant="outline" className="ml-2">{groupedJobs.draft.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed <Badge variant="outline" className="ml-2">{groupedJobs.closed.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="filled">
            Filled <Badge variant="outline" className="ml-2">{groupedJobs.filled.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedJobs).map(([status, jobs]) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="col-span-full text-center py-8">
                  <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                      ? "Try adjusting your filters"
                      : "Create your first job posting"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          <JobStatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm">{job.type}</span>
          <span className="text-sm">{job.location}{job.remote && " (Remote)"}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>
            Posted: {formatDate(job.postedDate)}
          </span>
          <span>
            {job.applicantsCount} applicants
          </span>
        </div>
        <Link to={`/jobs/${job.id}`}>
          <Button variant="secondary" className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function JobStatusBadge({ status }: { status: JobStatus }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  
  switch (status) {
    case "Published":
      variant = "default";
      break;
    case "Draft":
      variant = "outline";
      break;
    case "Closed":
      variant = "secondary";
      break;
    case "Filled":
      variant = "destructive";
      break;
  }
  
  return <Badge variant={variant}>{status}</Badge>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
}

export default JobsList;
