export interface TopicFaq {
  q: string;
  a: string;
}

export interface TopicPage {
  slug: string;
  /** Which content bank the page pulls from. */
  kind: "interview" | "scenario";
  /** Values matched against interview_questions.topic / scenario_questions.technology. */
  topics: string[];
  eyebrow: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  /** Short editorial context rendered above the question list. */
  prepPoints: string[];
  faqs: TopicFaq[];
  related: string[];
}

export const TOPIC_PAGES: TopicPage[] = [
  {
    slug: "aws-interview-questions",
    kind: "interview",
    topics: ["AWS", "autoscaling"],
    eyebrow: "AWS Interview Prep",
    h1: "AWS interview questions and answers",
    title: "AWS Interview Questions and Answers (2026) — Intervixa AI",
    description:
      "Practice real AWS interview questions with detailed answers on EC2, IAM, VPC, S3 and autoscaling, curated for Cloud and DevOps roles in India.",
    intro:
      "These AWS interview questions come from the same bank our Cloud and DevOps candidates practise with. Each one carries a hint, a full answer and an explanation, so you can test yourself first and only reveal the solution when you are stuck.",
    prepPoints: [
      "Know the core services cold: EC2, S3, IAM, VPC, RDS, CloudWatch and autoscaling.",
      "Be ready to explain trade-offs, not just definitions — why a NAT gateway over a NAT instance, when to pick Aurora over RDS.",
      "Expect at least one cost or security question in every AWS round.",
    ],
    faqs: [
      {
        q: "What AWS topics are asked most in interviews?",
        a: "IAM permissions, VPC networking, EC2 and autoscaling, S3 storage classes and lifecycle rules, and CloudWatch monitoring come up in almost every AWS interview for Cloud and DevOps roles.",
      },
      {
        q: "How should a fresher prepare for an AWS interview?",
        a: "Build one small end-to-end project — a VPC with public and private subnets, an EC2 app behind a load balancer, and S3 for static assets — then be able to explain every design choice you made.",
      },
    ],
    related: ["devops-interview-questions", "kubernetes-interview-questions", "terraform-interview-questions"],
  },
  {
    slug: "devops-interview-questions",
    kind: "interview",
    topics: [],
    eyebrow: "DevOps Interview Prep",
    h1: "DevOps interview questions and answers",
    title: "DevOps Interview Questions and Answers (2026) — Intervixa AI",
    description:
      "A full DevOps interview question bank covering Linux, AWS, Docker, Kubernetes, Terraform, Jenkins, Ansible and monitoring, each with a detailed answer.",
    intro:
      "A DevOps interview rarely stays on one tool. This bank spans the whole stack an interviewer walks through — Linux fundamentals, cloud, containers, infrastructure as code, CI/CD and observability — with an answer and explanation for every question.",
    prepPoints: [
      "Interviewers move tool to tool: Linux, then a cloud provider, then containers, then CI/CD.",
      "Prepare one pipeline story you own end to end — commit to production — with the failures you fixed.",
      "Troubleshooting questions outweigh definitions at every experience level above fresher.",
    ],
    faqs: [
      {
        q: "What is asked in a DevOps interview?",
        a: "Expect Linux troubleshooting, a cloud provider (usually AWS), Docker and Kubernetes, a CI/CD tool such as Jenkins or GitHub Actions, infrastructure as code with Terraform, and monitoring with Prometheus and Grafana.",
      },
      {
        q: "How many rounds does a DevOps interview have?",
        a: "Most Indian product and services companies run three to four rounds: a technical screen, a deep technical or scenario round, a system or infrastructure design discussion, and a managerial or HR round.",
      },
    ],
    related: ["aws-interview-questions", "docker-interview-questions", "linux-interview-questions"],
  },
  {
    slug: "docker-interview-questions",
    kind: "interview",
    topics: ["Docker"],
    eyebrow: "Docker Interview Prep",
    h1: "Docker interview questions and answers",
    title: "Docker Interview Questions and Answers (2026) — Intervixa AI",
    description:
      "Practice Docker interview questions on images, layers, volumes, networking and multi-stage builds, with detailed answers for DevOps roles.",
    intro:
      "Docker questions test whether you have actually built and shipped images or only run them. These cover image layers, volumes, networking modes and multi-stage builds, each with a hint before the full answer.",
    prepPoints: [
      "Be able to read a Dockerfile aloud and say what each instruction costs in layers and image size.",
      "Know the difference between a volume, a bind mount and tmpfs — and when each survives a container restart.",
      "Practise explaining why a container exits immediately, the single most common live-debug prompt.",
    ],
    faqs: [
      {
        q: "What is the difference between a Docker image and a container?",
        a: "An image is an immutable, layered filesystem template. A container is a running instance of that image with a writable layer on top, its own process namespace and its own network interface.",
      },
      {
        q: "Are Docker questions asked for fresher DevOps roles?",
        a: "Yes. Freshers are usually asked about images versus containers, basic Dockerfile instructions, port mapping and volumes, while experienced candidates get multi-stage builds, image size optimisation and registry security.",
      },
    ],
    related: ["docker-scenario-questions", "kubernetes-interview-questions", "devops-interview-questions"],
  },
  {
    slug: "kubernetes-interview-questions",
    kind: "interview",
    topics: ["Kubernetes"],
    eyebrow: "Kubernetes Interview Prep",
    h1: "Kubernetes interview questions and answers",
    title: "Kubernetes Interview Questions and Answers (2026) — Intervixa AI",
    description:
      "Kubernetes interview questions on pods, deployments, services, ingress, RBAC and troubleshooting, each with a detailed answer and explanation.",
    intro:
      "Kubernetes rounds move quickly from vocabulary to debugging. These questions cover pods, deployments, services, ingress, storage and RBAC, and each one includes the reasoning an interviewer is listening for.",
    prepPoints: [
      "Know the control plane components and what breaks when each one is down.",
      "Be fluent in the debug path: describe pod, logs, events, then node and scheduler state.",
      "Understand requests versus limits — throttling and OOMKills are a standard follow-up.",
    ],
    faqs: [
      {
        q: "What Kubernetes topics come up most in interviews?",
        a: "Pods and controllers, services and ingress, ConfigMaps and Secrets, persistent volumes, resource requests and limits, and troubleshooting a pod stuck in CrashLoopBackOff or Pending.",
      },
      {
        q: "Do I need CKA certification to clear a Kubernetes interview?",
        a: "No. Certification helps your resume pass filters, but interviews test hands-on debugging — running a cluster locally and breaking it deliberately prepares you better than the exam alone.",
      },
    ],
    related: ["kubernetes-scenario-questions", "docker-interview-questions", "aws-interview-questions"],
  },
  {
    slug: "terraform-interview-questions",
    kind: "interview",
    topics: ["Terraform"],
    eyebrow: "Terraform Interview Prep",
    h1: "Terraform interview questions and answers",
    title: "Terraform Interview Questions and Answers (2026) — Intervixa AI",
    description:
      "Terraform interview questions covering state, modules, workspaces, providers and drift, with detailed answers for Cloud and DevOps interviews.",
    intro:
      "Almost every Terraform interview turns on state: where it lives, who locks it, and what happens when it drifts from reality. These questions work through state, modules, workspaces and provider behaviour with full answers.",
    prepPoints: [
      "Explain remote state, locking and why a shared S3 backend with DynamoDB locking is the common pattern.",
      "Know when to use modules, and how to version and reuse them across environments.",
      "Be ready for a drift question: what terraform plan shows after someone edits a resource in the console.",
    ],
    faqs: [
      {
        q: "Why is Terraform state so important in interviews?",
        a: "State is how Terraform maps configuration to real infrastructure. Interviewers use it to check whether you have worked in a team — remote backends, locking, state moves and imports only come up in real shared environments.",
      },
      {
        q: "Terraform or CloudFormation for AWS interviews?",
        a: "Terraform is asked far more often in Indian DevOps interviews because it is cloud-agnostic, but knowing when a team would still pick CloudFormation is a strong answer.",
      },
    ],
    related: ["aws-interview-questions", "devops-interview-questions", "jenkins-interview-questions"],
  },
  {
    slug: "jenkins-interview-questions",
    kind: "interview",
    topics: ["Jenkins"],
    eyebrow: "Jenkins Interview Prep",
    h1: "Jenkins interview questions and answers",
    title: "Jenkins Interview Questions and Answers (2026) — Intervixa AI",
    description:
      "Jenkins interview questions on pipelines, Jenkinsfile syntax, agents, credentials and CI/CD best practice, each with a detailed answer.",
    intro:
      "Jenkins questions check that you have maintained a pipeline, not just triggered one. These cover declarative pipelines, agents, shared libraries, credentials handling and the failures that come with them.",
    prepPoints: [
      "Be able to sketch a Jenkinsfile from memory: agent, stages, post conditions.",
      "Know how credentials are injected and why secrets must never be echoed in build logs.",
      "Have an answer for scaling: agents, executors and why builds queue.",
    ],
    faqs: [
      {
        q: "What is the difference between scripted and declarative pipelines?",
        a: "Declarative pipelines use a structured pipeline block with predefined sections and are easier to validate and read. Scripted pipelines are Groovy code, giving more flexibility at the cost of maintainability.",
      },
      {
        q: "Is Jenkins still asked in 2026 interviews?",
        a: "Yes. Many Indian enterprises still run Jenkins in production, and interviewers often ask you to compare it with GitHub Actions or GitLab CI to see whether you understand CI/CD concepts rather than one tool.",
      },
    ],
    related: ["devops-interview-questions", "docker-interview-questions", "terraform-interview-questions"],
  },
  {
    slug: "linux-interview-questions",
    kind: "interview",
    topics: ["Linux", "linux"],
    eyebrow: "Linux Interview Prep",
    h1: "Linux interview questions and answers",
    title: "Linux Interview Questions and Answers for DevOps (2026) — Intervixa AI",
    description:
      "Linux interview questions on permissions, processes, systemd, networking and troubleshooting, with detailed answers for DevOps and Cloud roles.",
    intro:
      "Linux is the first filter in almost every DevOps interview. These questions cover permissions, processes, systemd services, disk and memory checks, and the command-by-command troubleshooting an interviewer expects to hear.",
    prepPoints: [
      "Practise saying your troubleshooting order out loud: load, memory, disk, network, logs.",
      "Know permissions arithmetic and what the sticky bit, SUID and SGID actually do.",
      "Be comfortable with systemd: starting, enabling and reading journal logs for a failing unit.",
    ],
    faqs: [
      {
        q: "Which Linux commands are asked in DevOps interviews?",
        a: "top, ps, df, du, free, netstat or ss, lsof, journalctl, grep, awk, sed, chmod and chown come up constantly, usually inside a troubleshooting scenario rather than as isolated definitions.",
      },
      {
        q: "How deep should Linux knowledge go for a fresher role?",
        a: "For freshers, file permissions, process management, basic networking and log reading are enough. Kernel tuning and namespaces are expected only from mid-level candidates upwards.",
      },
    ],
    related: ["devops-interview-questions", "docker-interview-questions", "aws-interview-questions"],
  },
  {
    slug: "docker-scenario-questions",
    kind: "scenario",
    topics: ["Docker"],
    eyebrow: "Docker Scenarios",
    h1: "Docker scenario-based interview questions",
    title: "Docker Scenario-Based Interview Questions (2026) — Intervixa AI",
    description:
      "Real production Docker scenarios — containers exiting, image bloat, volume and networking failures — with the reasoning and fix an interviewer wants.",
    intro:
      "Scenario rounds hand you a broken system and watch how you think. These Docker scenarios describe a real production symptom, give you a hint, then walk through the diagnosis and the fix.",
    prepPoints: [
      "Narrate your diagnosis aloud — interviewers score the order you check things in.",
      "Always state what you would check first and why before jumping to a fix.",
      "Finish with prevention: what you would change so the incident does not repeat.",
    ],
    faqs: [
      {
        q: "What are Docker scenario-based interview questions?",
        a: "They describe a realistic production problem — a container that exits on start, an image that ballooned to several gigabytes, a volume that lost data — and ask how you would diagnose and fix it step by step.",
      },
      {
        q: "How do I answer a scenario question well?",
        a: "State your assumptions, list the commands or signals you would check in order, name the most likely root cause, then give the fix and a prevention step. Structure matters more than getting the exact cause right.",
      },
    ],
    related: ["docker-interview-questions", "kubernetes-scenario-questions", "devops-interview-questions"],
  },
  {
    slug: "kubernetes-scenario-questions",
    kind: "scenario",
    topics: ["Kubernetes"],
    eyebrow: "Kubernetes Scenarios",
    h1: "Kubernetes scenario-based interview questions",
    title: "Kubernetes Scenario-Based Interview Questions (2026) — Intervixa AI",
    description:
      "Production Kubernetes scenarios — CrashLoopBackOff, pending pods, OOMKills, ingress and node failures — with step-by-step diagnosis and fixes.",
    intro:
      "These Kubernetes scenarios mirror what breaks in real clusters: pods stuck pending, containers OOMKilled, ingress returning 502s, nodes going NotReady. Each includes a hint, the diagnosis path and the fix.",
    prepPoints: [
      "Start every answer at the object level: describe the pod, read events, then logs.",
      "Separate scheduling problems (Pending) from runtime problems (CrashLoopBackOff) early.",
      "Mention resource requests, limits and node capacity — most cluster incidents trace back there.",
    ],
    faqs: [
      {
        q: "How do I debug a pod stuck in CrashLoopBackOff?",
        a: "Run kubectl describe pod to read events and the last termination reason, then kubectl logs --previous for the crashed container. Common causes are a failing command, a missing ConfigMap or Secret, a failing liveness probe, or an OOMKill from a low memory limit.",
      },
      {
        q: "Why would a pod stay in Pending state?",
        a: "Usually no node can satisfy it: insufficient CPU or memory, an unbound PersistentVolumeClaim, a node selector or affinity rule that matches nothing, or a taint without a matching toleration.",
      },
    ],
    related: ["kubernetes-interview-questions", "docker-scenario-questions", "devops-interview-questions"],
  },
];

export const getTopicPage = (slug: string) => TOPIC_PAGES.find((p) => p.slug === slug);
