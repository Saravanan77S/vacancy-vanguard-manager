
import { faker } from "@faker-js/faker";

// Job Categories
export const jobCategories = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Service",
  "Finance",
  "Human Resources",
  "Administration",
  "Engineering",
  "Product Management",
];

// Job Type
export type JobType = "Full-time" | "Part-time" | "Contract" | "Temporary" | "Internship";

// Job Status
export type JobStatus = "Draft" | "Published" | "Closed" | "Filled";

// Skills
export const skillsList = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js",
  "Python", "Java", "C#", "PHP", "Ruby", "Go", "Swift", "Kotlin",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Firebase",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
  "UI/UX Design", "Figma", "Adobe XD", "Sketch",
  "Marketing", "SEO", "Content Writing", "Social Media",
  "Sales", "CRM", "Lead Generation",
  "Customer Service", "Help Desk", "Support",
  "Finance", "Accounting", "Budgeting",
  "HR", "Recruitment", "Onboarding",
  "Project Management", "Agile", "Scrum", "Kanban",
  "Communication", "Team Management", "Leadership",
];

// Report Type
export type ReportType = "Technical Issue" | "Feature Request" | "Candidate Issue" | "Other";

// Report Status
export type ReportStatus = "New" | "In Progress" | "Resolved" | "Closed";

// Job Interface
export interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  type: JobType;
  location: string;
  remote: boolean;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  postedBy: string;
  postedDate: Date;
  deadline: Date;
  status: JobStatus;
  applicantsCount: number;
}

// Applicant Interface
export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  skills: string[];
  experience: number;
  appliedDate: Date;
  status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected" | "Hired";
}

// Report Interface
export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  status: ReportStatus;
  createdBy: string;
  createdDate: Date;
  updatedDate: Date;
}

// Generate mock jobs
export const generateMockJobs = (count: number): Job[] => {
  return Array(count)
    .fill(null)
    .map(() => {
      const title = faker.person.jobTitle();
      const company = faker.company.name();
      const description = faker.lorem.paragraphs(3);
      const requirements = Array(faker.number.int({ min: 3, max: 8 }))
        .fill(null)
        .map(() => faker.lorem.sentence());
      const salaryMin = faker.number.int({ min: 30000, max: 70000 });
      const salaryMax = faker.number.int({ min: salaryMin + 10000, max: salaryMin + 50000 });
      const postedDate = faker.date.past({ days: 30 });
      const deadline = faker.date.future({ refDate: postedDate, years: 0.5 });
      const status: JobStatus = faker.helpers.arrayElement(["Draft", "Published", "Closed", "Filled"]);
      const remote = faker.datatype.boolean();

      return {
        id: faker.string.uuid(),
        title,
        company,
        category: faker.helpers.arrayElement(jobCategories),
        type: faker.helpers.arrayElement(["Full-time", "Part-time", "Contract", "Temporary", "Internship"]) as JobType,
        location: remote ? "Remote" : faker.location.city(),
        remote,
        description,
        requirements,
        salary: {
          min: salaryMin,
          max: salaryMax,
          currency: "USD",
        },
        postedBy: "Sarah Johnson",
        postedDate,
        deadline,
        status,
        applicantsCount: faker.number.int({ min: 0, max: 50 }),
      };
    });
};

// Generate mock applicants
export const generateMockApplicants = (count: number, jobId: string): Applicant[] => {
  return Array(count)
    .fill(null)
    .map(() => {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const phone = faker.phone.number();
      const skills = Array(faker.number.int({ min: 3, max: 8 }))
        .fill(null)
        .map(() => faker.helpers.arrayElement(skillsList));

      return {
        id: faker.string.uuid(),
        jobId,
        name,
        email,
        phone,
        resume: "resume.pdf",
        coverLetter: faker.lorem.paragraphs(2),
        skills,
        experience: faker.number.int({ min: 0, max: 15 }),
        appliedDate: faker.date.recent({ days: 14 }),
        status: faker.helpers.arrayElement(["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"]),
      };
    });
};

// Generate mock reports
export const generateMockReports = (count: number): Report[] => {
  return Array(count)
    .fill(null)
    .map(() => {
      const createdDate = faker.date.recent({ days: 30 });
      const updatedDate = faker.date.between({ from: createdDate, to: new Date() });

      return {
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        type: faker.helpers.arrayElement(["Technical Issue", "Feature Request", "Candidate Issue", "Other"]) as ReportType,
        status: faker.helpers.arrayElement(["New", "In Progress", "Resolved", "Closed"]) as ReportStatus,
        createdBy: "Sarah Johnson",
        createdDate,
        updatedDate,
      };
    });
};

// Create initial mock data
export const mockJobs = generateMockJobs(12);
export const mockReports = generateMockReports(5);

// Function to get applicants for a specific job
export const getMockApplicantsForJob = (jobId: string): Applicant[] => {
  const job = mockJobs.find(job => job.id === jobId);
  if (!job) return [];
  return generateMockApplicants(job.applicantsCount, jobId);
};

// Function to get active/ongoing jobs
export const getActiveJobs = (): Job[] => {
  return mockJobs.filter(job => job.status === "Published");
};

// Function to get all jobs
export const getAllJobs = (): Job[] => {
  return mockJobs;
};

// Function to get a specific job
export const getJob = (id: string): Job | undefined => {
  return mockJobs.find(job => job.id === id);
};
