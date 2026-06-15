import ReactMarkdown from "react-markdown";
import VisaDetailCard from "@/components/visas/VisaDetailCard";
import type { VisaDetailData } from "@/components/visas/VisaDetailCard";
import VisaCardGrid from "@/components/visas/VisaCardGrid";
import type { VisaCardData } from "@/components/visas/VisaCardGrid";
import ServiceCardGrid from "@/components/service/ServiceCardGrid";
import type { ServiceCardData } from "@/components/service/ServiceCardGrid";
import BudgetSummaryCard from "@/components/budget/BudgetSummaryCard";
import type { BudgetSummaryData } from "@/components/budget/BudgetSummaryCard";
import ChecklistLinkCard from "@/components/checklist/ChecklistLinkCard";
import BudgetLinkCard from "@/components/chats/BudgetLinkCard";

export const markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  code(props: any) {
    const { children, className } = props;
    if (className === "language-visa-cards") {
      try {
        const visas: VisaCardData[] = JSON.parse(String(children).trim());
        return <VisaCardGrid visas={visas} />;
      } catch {
      }
    }
    if (className === "language-visa-detail") {
      try {
        const visa: VisaDetailData = JSON.parse(String(children).trim());
        return <VisaDetailCard v={visa} />;
      } catch {
      }
    }
    if (className === "language-service-cards") {
      try {
        const services: ServiceCardData[] = JSON.parse(String(children).trim());
        return <ServiceCardGrid services={services} />;
      } catch {
      }
    }
    if (className === "language-checklist-link") {
      try {
        const { id, name, items_created } = JSON.parse(String(children).trim());
        return <ChecklistLinkCard id={id} name={name} items_created={items_created} />;
      } catch {
      }
    }
    if (className === "language-budget-summary") {
      try {
        const data: BudgetSummaryData = JSON.parse(String(children).trim());
        return <BudgetSummaryCard b={data} />;
      } catch {
      }
    }
    if (className === "language-budget-link") {
      try {
        const { id, name } = JSON.parse(String(children).trim());
        return <BudgetLinkCard id={id} name={name} />;
      } catch {
      }
    }
    return <code className={className}>{children}</code>;
  },
};

export default markdownComponents;
