import type { ProviderMember } from "@/lib/types";
import CreateBusinessFormContent from "./CreateBusinessFormContent";

type Props = {
  userId: string;
  userEmail: string;
  onCreated: (member: ProviderMember) => void;
  onCancel: () => void;
};

export function CreateBusinessForm(props: Props) {
  return <CreateBusinessFormContent {...props} />;
}

export default CreateBusinessForm;
