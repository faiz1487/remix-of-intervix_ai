export type WorkMode = "Remote" | "Hybrid" | "Onsite";
export type CloudPlatform = "AWS" | "Azure" | "GCP" | "Multi-Cloud";

export interface DevOpsJob {
  id: string;
  title: string;
  company: string;
  logo: string; // emoji / initials fallback
  location: string;
  workMode: WorkMode;
  salary: string;
  experience: string;
  minExp: number;
  cloud: CloudPlatform;
  skills: string[];
  certifications: string[];
  source:
    | "LinkedIn"
    | "Indeed"
    | "Wellfound"
    | "Greenhouse"
    | "Lever"
    | "Ashby"
    | "SmartRecruiters"
    | "Workday"
    | "Company Careers";
  postedDaysAgo: number;
  applyLink: string;
  description: string;
}

export const CLOUD_DEVOPS_ROLES = [
  "DevOps Engineer",
  "Senior DevOps Engineer",
  "Junior DevOps Engineer",
  "Cloud Engineer",
  "AWS Cloud Engineer",
  "Azure Cloud Engineer",
  "GCP Cloud Engineer",
  "Cloud Infrastructure Engineer",
  "Site Reliability Engineer (SRE)",
  "Platform Engineer",
  "Infrastructure Engineer",
  "Kubernetes Engineer",
  "Kubernetes Administrator",
  "Docker Engineer",
  "Linux System Administrator",
  "Linux Engineer",
  "Cloud Operations Engineer",
  "Production Support Engineer",
  "Build & Release Engineer",
  "CI/CD Engineer",
  "Automation Engineer",
  "Infrastructure Automation Engineer",
  "Terraform Engineer",
  "DevSecOps Engineer",
  "Cloud Security Engineer",
  "Monitoring Engineer",
  "Observability Engineer",
  "Reliability Engineer",
  "Systems Engineer",
  "Cloud Consultant",
  "Platform Reliability Engineer",
] as const;

export const DEVOPS_SKILLS = [
  "AWS", "Azure", "GCP", "Linux", "Docker", "Kubernetes", "Terraform", "Ansible",
  "Jenkins", "GitHub Actions", "GitLab CI", "ArgoCD", "Helm", "Prometheus", "Grafana",
  "ELK", "Datadog", "Splunk", "Nginx", "Apache", "Redis", "Kafka", "RabbitMQ",
  "Bash", "Python", "Go", "Networking", "IAM", "VPC", "ECS", "EKS", "AKS", "GKE",
  "EC2", "S3", "RDS", "CloudFormation", "Monitoring", "Incident Management",
  "CI/CD", "Infrastructure as Code",
];

export const DEVOPS_CERTIFICATIONS = [
  "AWS Solutions Architect",
  "AWS DevOps Engineer Professional",
  "CKA",
  "CKAD",
  "Terraform Associate",
  "RHCSA",
  "Azure Administrator",
  "Google Professional Cloud Engineer",
];

export const DEVOPS_JOBS: DevOpsJob[] = [
  {
    id: "j1", title: "Senior DevOps Engineer", company: "Amazon", logo: "AM",
    location: "Bengaluru, India", workMode: "Hybrid", salary: "₹32–48 LPA",
    experience: "5–9 yrs", minExp: 5, cloud: "AWS",
    skills: ["AWS", "Terraform", "Kubernetes", "EKS", "CI/CD", "Python", "Linux", "Monitoring"],
    certifications: ["AWS DevOps Engineer Professional", "CKA"],
    source: "LinkedIn", postedDaysAgo: 1, applyLink: "https://www.linkedin.com/jobs/",
    description: "Own large-scale AWS infrastructure, IaC pipelines and multi-region EKS platforms.",
  },
  {
    id: "j2", title: "Site Reliability Engineer (SRE)", company: "Google", logo: "GO",
    location: "Hyderabad, India", workMode: "Hybrid", salary: "₹38–60 LPA",
    experience: "4–8 yrs", minExp: 4, cloud: "GCP",
    skills: ["GCP", "GKE", "Go", "Prometheus", "Grafana", "Incident Management", "Kubernetes", "Linux"],
    certifications: ["Google Professional Cloud Engineer", "CKA"],
    source: "Company Careers", postedDaysAgo: 2, applyLink: "https://careers.google.com/",
    description: "Drive reliability, SLOs and error budgets for planet-scale services.",
  },
  {
    id: "j3", title: "Azure Cloud Engineer", company: "Microsoft", logo: "MS",
    location: "Noida, India", workMode: "Hybrid", salary: "₹24–38 LPA",
    experience: "3–6 yrs", minExp: 3, cloud: "Azure",
    skills: ["Azure", "AKS", "Terraform", "Bash", "IAM", "Networking", "CI/CD"],
    certifications: ["Azure Administrator", "Terraform Associate"],
    source: "Workday", postedDaysAgo: 3, applyLink: "https://careers.microsoft.com/",
    description: "Build secure Azure landing zones and automate platform provisioning.",
  },
  {
    id: "j4", title: "Platform Engineer", company: "HashiCorp", logo: "HC",
    location: "Remote (India)", workMode: "Remote", salary: "₹35–55 LPA",
    experience: "4–8 yrs", minExp: 4, cloud: "Multi-Cloud",
    skills: ["Terraform", "Go", "Kubernetes", "Helm", "Infrastructure as Code", "GitHub Actions"],
    certifications: ["Terraform Associate", "CKA"],
    source: "Greenhouse", postedDaysAgo: 1, applyLink: "https://www.hashicorp.com/careers",
    description: "Develop internal developer platforms and self-service infrastructure workflows.",
  },
  {
    id: "j5", title: "Kubernetes Administrator", company: "Red Hat", logo: "RH",
    location: "Pune, India", workMode: "Hybrid", salary: "₹20–32 LPA",
    experience: "3–6 yrs", minExp: 3, cloud: "Multi-Cloud",
    skills: ["Kubernetes", "Linux", "Helm", "ArgoCD", "Ansible", "Prometheus"],
    certifications: ["CKA", "RHCSA"],
    source: "Lever", postedDaysAgo: 4, applyLink: "https://www.redhat.com/en/jobs",
    description: "Operate OpenShift/Kubernetes clusters for enterprise customers.",
  },
  {
    id: "j6", title: "DevSecOps Engineer", company: "Cisco", logo: "CS",
    location: "Bengaluru, India", workMode: "Hybrid", salary: "₹26–40 LPA",
    experience: "4–7 yrs", minExp: 4, cloud: "AWS",
    skills: ["AWS", "IAM", "Kubernetes", "CI/CD", "Python", "Monitoring", "Docker"],
    certifications: ["AWS Solutions Architect", "CKA"],
    source: "Workday", postedDaysAgo: 5, applyLink: "https://jobs.cisco.com/",
    description: "Embed security scanning and policy-as-code across CI/CD pipelines.",
  },
  {
    id: "j7", title: "Cloud Infrastructure Engineer", company: "Oracle", logo: "OR",
    location: "Hyderabad, India", workMode: "Onsite", salary: "₹18–30 LPA",
    experience: "3–7 yrs", minExp: 3, cloud: "Multi-Cloud",
    skills: ["Linux", "Terraform", "Networking", "VPC", "Ansible", "Bash"],
    certifications: ["Terraform Associate"],
    source: "Company Careers", postedDaysAgo: 6, applyLink: "https://careers.oracle.com/",
    description: "Design and operate OCI infrastructure with full automation coverage.",
  },
  {
    id: "j8", title: "Observability Engineer", company: "Datadog-partner · EPAM", logo: "EP",
    location: "Remote (India)", workMode: "Remote", salary: "₹22–35 LPA",
    experience: "3–6 yrs", minExp: 3, cloud: "AWS",
    skills: ["Datadog", "Prometheus", "Grafana", "ELK", "Monitoring", "Kubernetes", "Python"],
    certifications: ["AWS Solutions Architect"],
    source: "SmartRecruiters", postedDaysAgo: 2, applyLink: "https://www.epam.com/careers",
    description: "Build unified observability stacks: metrics, logs, traces and alerting.",
  },
  {
    id: "j9", title: "CI/CD Engineer", company: "GitLab", logo: "GL",
    location: "Remote", workMode: "Remote", salary: "₹28–45 LPA",
    experience: "3–6 yrs", minExp: 3, cloud: "GCP",
    skills: ["GitLab CI", "Docker", "Kubernetes", "Helm", "Bash", "CI/CD", "Go"],
    certifications: ["CKAD"],
    source: "Greenhouse", postedDaysAgo: 1, applyLink: "https://about.gitlab.com/jobs/",
    description: "Scale build and release pipelines for a fully remote engineering org.",
  },
  {
    id: "j10", title: "AWS Cloud Engineer", company: "Rackspace", logo: "RS",
    location: "Gurugram, India", workMode: "Hybrid", salary: "₹16–26 LPA",
    experience: "2–5 yrs", minExp: 2, cloud: "AWS",
    skills: ["AWS", "EC2", "S3", "RDS", "CloudFormation", "Linux", "IAM"],
    certifications: ["AWS Solutions Architect"],
    source: "Indeed", postedDaysAgo: 7, applyLink: "https://www.rackspace.com/careers",
    description: "Deliver managed AWS operations for global enterprise accounts.",
  },
  {
    id: "j11", title: "Junior DevOps Engineer", company: "Nagarro", logo: "NG",
    location: "Jaipur, India", workMode: "Hybrid", salary: "₹6–11 LPA",
    experience: "0–2 yrs", minExp: 0, cloud: "Azure",
    skills: ["Linux", "Docker", "Jenkins", "Bash", "Azure", "CI/CD"],
    certifications: ["Azure Administrator"],
    source: "LinkedIn", postedDaysAgo: 2, applyLink: "https://www.nagarro.com/en/careers",
    description: "Support build pipelines and containerised deployments under mentorship.",
  },
  {
    id: "j12", title: "Infrastructure Automation Engineer", company: "Infosys", logo: "IN",
    location: "Pune, India", workMode: "Onsite", salary: "₹12–20 LPA",
    experience: "3–6 yrs", minExp: 3, cloud: "Multi-Cloud",
    skills: ["Ansible", "Terraform", "Python", "Linux", "Infrastructure as Code", "Nginx"],
    certifications: ["RHCSA", "Terraform Associate"],
    source: "Company Careers", postedDaysAgo: 5, applyLink: "https://www.infosys.com/careers/",
    description: "Automate provisioning and configuration for large client estates.",
  },
  {
    id: "j13", title: "Cloud Operations Engineer", company: "TCS", logo: "TC",
    location: "Chennai, India", workMode: "Onsite", salary: "₹8–15 LPA",
    experience: "2–5 yrs", minExp: 2, cloud: "AWS",
    skills: ["AWS", "Linux", "Monitoring", "Incident Management", "Bash", "Nginx"],
    certifications: ["AWS Solutions Architect"],
    source: "Indeed", postedDaysAgo: 9, applyLink: "https://www.tcs.com/careers",
    description: "Run 24x7 cloud operations, incident triage and RCA for managed clients.",
  },
  {
    id: "j14", title: "Linux System Administrator", company: "Canonical", logo: "CA",
    location: "Remote", workMode: "Remote", salary: "₹18–30 LPA",
    experience: "3–7 yrs", minExp: 3, cloud: "Multi-Cloud",
    skills: ["Linux", "Bash", "Networking", "Apache", "Nginx", "Ansible"],
    certifications: ["RHCSA"],
    source: "Greenhouse", postedDaysAgo: 3, applyLink: "https://canonical.com/careers",
    description: "Maintain Ubuntu fleets and automate system-level operations at scale.",
  },
  {
    id: "j15", title: "Terraform Engineer", company: "Deloitte", logo: "DE",
    location: "Bengaluru, India", workMode: "Hybrid", salary: "₹20–33 LPA",
    experience: "4–7 yrs", minExp: 4, cloud: "Azure",
    skills: ["Terraform", "Azure", "AKS", "Infrastructure as Code", "GitHub Actions", "IAM"],
    certifications: ["Terraform Associate", "Azure Administrator"],
    source: "Workday", postedDaysAgo: 4, applyLink: "https://www2.deloitte.com/careers",
    description: "Lead IaC modernization engagements for BFSI cloud migrations.",
  },
  {
    id: "j16", title: "Reliability Engineer", company: "Cloudflare", logo: "CF",
    location: "Remote (India)", workMode: "Remote", salary: "₹30–50 LPA",
    experience: "4–8 yrs", minExp: 4, cloud: "Multi-Cloud",
    skills: ["Go", "Linux", "Networking", "Prometheus", "Incident Management", "Kubernetes"],
    certifications: ["CKA"],
    source: "Ashby", postedDaysAgo: 2, applyLink: "https://www.cloudflare.com/careers/",
    description: "Keep edge network services reliable across hundreds of PoPs.",
  },
  {
    id: "j17", title: "Build & Release Engineer", company: "Adobe", logo: "AD",
    location: "Noida, India", workMode: "Hybrid", salary: "₹22–36 LPA",
    experience: "3–6 yrs", minExp: 3, cloud: "AWS",
    skills: ["Jenkins", "Docker", "Bash", "Python", "CI/CD", "Kubernetes"],
    certifications: ["CKAD"],
    source: "Workday", postedDaysAgo: 6, applyLink: "https://careers.adobe.com/",
    description: "Own release engineering and artifact pipelines for creative cloud services.",
  },
  {
    id: "j18", title: "Cloud Security Engineer", company: "IBM", logo: "IB",
    location: "Bengaluru, India", workMode: "Hybrid", salary: "₹19–31 LPA",
    experience: "3–7 yrs", minExp: 3, cloud: "Multi-Cloud",
    skills: ["IAM", "AWS", "Azure", "Kubernetes", "Monitoring", "Splunk", "Networking"],
    certifications: ["AWS Solutions Architect", "Azure Administrator"],
    source: "Company Careers", postedDaysAgo: 8, applyLink: "https://www.ibm.com/careers",
    description: "Harden multi-cloud workloads and lead cloud security posture management.",
  },
  {
    id: "j19", title: "Platform Reliability Engineer", company: "Atlassian", logo: "AT",
    location: "Remote (India)", workMode: "Remote", salary: "₹34–52 LPA",
    experience: "5–9 yrs", minExp: 5, cloud: "AWS",
    skills: ["AWS", "Kubernetes", "Terraform", "Kafka", "Redis", "Monitoring", "Python"],
    certifications: ["AWS DevOps Engineer Professional", "CKA"],
    source: "Lever", postedDaysAgo: 1, applyLink: "https://www.atlassian.com/company/careers",
    description: "Improve reliability of core platform services powering Jira and Confluence.",
  },
  {
    id: "j20", title: "GCP Cloud Engineer", company: "LTIMindtree", logo: "LT",
    location: "Mumbai, India", workMode: "Hybrid", salary: "₹14–24 LPA",
    experience: "3–6 yrs", minExp: 3, cloud: "GCP",
    skills: ["GCP", "GKE", "Terraform", "Linux", "Docker", "CI/CD", "Bash"],
    certifications: ["Google Professional Cloud Engineer"],
    source: "SmartRecruiters", postedDaysAgo: 5, applyLink: "https://www.ltimindtree.com/careers/",
    description: "Migrate and operate customer workloads on Google Cloud with IaC.",
  },
];
