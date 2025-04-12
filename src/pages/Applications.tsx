
import { useState } from "react";
import { Check, Download, MailIcon, Phone, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Applicant, 
  getMockApplicantsForJob, 
  Job, 
  getAllJobs 
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const Applications = () => {
  const toast = useToast();
  const jobs = getAllJobs();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get applicants for the selected job
  const allApplicants = selectedJobId 
    ? getMockApplicantsForJob(selectedJobId) 
    : [];

  // Filter applicants based on search query and status filter
  const filteredApplicants = allApplicants.filter((applicant) => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group applicants by status
  const groupedApplicants = {
    all: filteredApplicants,
    pending: filteredApplicants.filter(app => app.status === "Pending"),
    reviewed: filteredApplicants.filter(app => app.status === "Reviewed"),
    shortlisted: filteredApplicants.filter(app => app.status === "Shortlisted"),
    rejected: filteredApplicants.filter(app => app.status === "Rejected"),
    hired: filteredApplicants.filter(app => app.status === "Hired"),
  };

  const handleAccept = (applicant: Applicant) => {
    toast({
      title: "Applicant Hired",
      description: `${applicant.name} has been hired successfully.`,
    });
    // In a real app, we would update the applicant's status in the database
  };

  const handleReject = (applicant: Applicant) => {
    toast({
      title: "Applicant Rejected",
      description: `${applicant.name} has been rejected.`,
      variant: "destructive",
    });
    // In a real app, we would update the applicant's status in the database
  };

  const handleSendSMS = (applicant: Applicant) => {
    toast.success(`SMS notification sent to ${applicant.name}`);
    // In a real app, we would trigger an SMS sending service
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
        <p className="text-muted-foreground">
          Review and manage candidates for your job postings.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-1/3">
          <Select 
            value={selectedJobId} 
            onValueChange={setSelectedJobId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a job" />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applicants..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="md:w-1/4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedJobId ? (
        <div>
          <JobDetail job={jobs.find(job => job.id === selectedJobId)} />
          
          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">
                All <Badge variant="outline" className="ml-2">{groupedApplicants.all.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending <Badge variant="outline" className="ml-2">{groupedApplicants.pending.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed <Badge variant="outline" className="ml-2">{groupedApplicants.reviewed.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="shortlisted">
                Shortlisted <Badge variant="outline" className="ml-2">{groupedApplicants.shortlisted.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="hired">
                Hired <Badge variant="outline" className="ml-2">{groupedApplicants.hired.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected <Badge variant="outline" className="ml-2">{groupedApplicants.rejected.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {Object.entries(groupedApplicants).map(([status, applicants]) => (
              <TabsContent key={status} value={status} className="mt-6">
                <div className="space-y-4">
                  {applicants.length > 0 ? (
                    applicants.map((applicant) => (
                      <ApplicantCard 
                        key={applicant.id} 
                        applicant={applicant} 
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onSendSMS={handleSendSMS}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No applicants found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== 'all'
                          ? "Try adjusting your filters"
                          : "No applications have been received yet"}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No job selected</h3>
          <p className="text-muted-foreground mt-2">
            Please select a job to view its applications
          </p>
        </div>
      )}
    </div>
  );
};

function JobDetail({ job }: { job: Job | undefined }) {
  if (!job) return null;
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{job.title}</CardTitle>
          <Badge variant="secondary">
            {job.applicantsCount} applicants
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>{job.type}</span>
          <span>•</span>
          <span>{job.location}{job.remote ? " (Remote)" : ""}</span>
          <span>•</span>
          <span>Posted on {formatDate(job.postedDate)}</span>
          <span>•</span>
          <span>Deadline: {formatDate(job.deadline)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ApplicantCardProps {
  applicant: Applicant;
  onAccept: (applicant: Applicant) => void;
  onReject: (applicant: Applicant) => void;
  onSendSMS: (applicant: Applicant) => void;
}

function ApplicantCard({ applicant, onAccept, onReject, onSendSMS }: ApplicantCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isPending = applicant.status === "Pending" || applicant.status === "Reviewed";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" alt={applicant.name} />
              <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{applicant.name}</h3>
              <div className="flex flex-col text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MailIcon className="mr-2 h-3.5 w-3.5" />
                  <span>{applicant.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-3.5 w-3.5" />
                  <span>{applicant.phone}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:ml-auto flex items-center space-x-2 flex-wrap gap-2">
            <Badge variant={statusBadgeVariant(applicant.status)}>
              {applicant.status}
            </Badge>
            <Badge variant="outline">
              {applicant.experience} years exp
            </Badge>
            {isPending && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8"
                  onClick={() => onAccept(applicant)}
                >
                  <Check className="mr-2 h-3.5 w-3.5" />
                  Accept
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-8 border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => onReject(applicant)}
                >
                  <X className="mr-2 h-3.5 w-3.5" />
                  Reject
                </Button>
              </>
            )}
            <Button 
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => onSendSMS(applicant)}
            >
              Send SMS
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            variant="ghost" 
            className="p-0 h-auto text-sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "Show details"}
          </Button>
          
          {showDetails && (
            <div className="mt-4 space-y-4">
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Cover Letter</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {applicant.coverLetter}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Resume</h4>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Application Date</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(applicant.appliedDate)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function statusBadgeVariant(status: Applicant['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Hired":
      return "default";
    case "Shortlisted":
      return "secondary";
    case "Rejected":
      return "destructive";
    default:
      return "outline";
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export default Applications;
