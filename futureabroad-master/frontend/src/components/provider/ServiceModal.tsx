import type { Service, ServiceType } from "@/lib/types";
import ServiceModalContent from "./ServiceModalContent";

export function ServiceModal({
  providerId,
  service,
  serviceTypes,
  onSave,
  onClose,
}: {
  providerId: string;
  service: Service | null;
  serviceTypes: ServiceType[];
  onSave: (s: Service) => void;
  onClose: () => void;
}) {
  return <ServiceModalContent providerId={providerId} service={service} serviceTypes={serviceTypes} onSave={onSave} onClose={onClose} />;
}

export default ServiceModal;
