import {
  Activity,
  Briefcase,
  FolderOpen,
  Users,
  Phone,
  PhoneCall,
  Table,
  CreditCard,
  History,
  BarChart2,
  UserCheck,
  UserCog,
  ClipboardCheck,
  Building2,
  Settings,
  PieChart,
  Shield,
  UserSquare,
  FileText
} from "lucide-react";

export const SIDEBAR_CONFIG = [
  {
    key: "overview",
    type: "item",
    label: "Executive Overview",
    path: "/dashboard/overview",
    icon: Activity,
    section: "MAIN"
  },

  {
    key: "sales",
    type: "menu",
    label: "Sales & Pipeline",
    icon: Briefcase,
    section: "SALES",
    children: [
      { key: "leads", label: "Leads", path: "/sales/leads", icon: Briefcase },
      { key: "opportunities", label: "Opportunities", path: "/sales/opportunities", icon: Briefcase },
      { key: "pipeline", label: "Deal Pipeline", path: "/sales/pipeline", icon: Briefcase },
      { key: "closedDeals", label: "Closed Deals", path: "/sales/closed", icon: Briefcase },
      { key: "projects", label: "Manage Projects", path: "/management/projects", icon: FolderOpen }
    ]
  },

  {
    key: "operations",
    type: "menu",
    label: "Project Operations",
    icon: Briefcase,
    section: "OPERATIONS",
    children: [
      { key: "activeProjects", label: "Active Projects", path: "/operations/active", icon: Briefcase },
      { key: "archivedProjects", label: "Archived Projects", path: "/operations/archived", icon: Briefcase }
    ]
  },

  {
    key: "clients",
    type: "menu",
    label: "Client Management",
    icon: Users,
    section: "CLIENTS",
    children: [
      { key: "clientDirectory", label: "Client Directory", path: "/management/clients", icon: Users },
      { key: "clientQueries", label: "Client Queries", path: "/management/queries", icon: Phone },
      { key: "callback", label: "Callback Requests", path: "/management/callback", icon: PhoneCall },
      { key: "billingGenerate", label: "Bill Generate", path: "/management/billing/generate", icon: CreditCard },
      { key: "billingHistory", label: "Invoice History", path: "/management/billing/history", icon: History }
    ]
  },

  {
    key: "finance",
    type: "menu",
    label: "Finance & Contracts",
    icon: BarChart2,
    section: "FINANCE",
    children: [
      { key: "contracts", label: "Contracts", path: "/finance/contracts", icon: BarChart2 },
      { key: "invoices", label: "Invoices", path: "/finance/invoices", icon: UserCheck },
      { key: "revenue", label: "Revenue Reports", path: "/finance/reports", icon: PieChart }
    ]
  },

  {
    key: "performance",
    type: "menu",
    label: "Evaluation & Monitoring",
    icon: BarChart2,
    section: "PERFORMANCE",
    children: [
      { key: "performanceDashboard", label: "Performance Dashboard", path: "/performance", icon: BarChart2 },
      { key: "agentEval", label: "Agent Evaluation", path: "/performance/agent", icon: UserCheck }
    ]
  },

  {
    key: "identity",
    type: "item",
    label: "Identity & Access",
    path: "/dashboard/identity",
    icon: Shield,
    section: "ADMINISTRATION"
  },

  {
    key: "blogs",
    type: "item",
    label: "Blogs",
    path: "/management/blogs",
    icon: FileText,
    section: "CONTENT"
  }
];