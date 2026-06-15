import { HugeiconsIcon } from "@hugeicons/react";
import {
  Task01Icon,
  Globe02Icon,
  ShoppingBag01Icon,
  Wallet01Icon,
  UserGroup02Icon,
  Calculator01Icon,
  CheckmarkCircle02Icon,
  Shield02Icon,
  Clock01Icon,
  Calendar01Icon,
  File02Icon,
  ArrowRight01Icon,
  StarIcon,
  Sun01Icon,
  HeartCheckIcon,
  Tag01Icon,
  LanguageCircleIcon,
  CloudSnowIcon,
} from "@hugeicons/core-free-icons";

export const renderIcon = (iconName: string, className = "w-6 h-6") => {
  const iconProps = { className, strokeWidth: 2 } as any;
  switch (iconName) {
    case "task":
      return <HugeiconsIcon icon={Task01Icon} {...iconProps} />;
    case "globe":
      return <HugeiconsIcon icon={Globe02Icon} {...iconProps} />;
    case "briefcase":
      return <HugeiconsIcon icon={ShoppingBag01Icon} {...iconProps} />;
    case "wallet":
      return <HugeiconsIcon icon={Wallet01Icon} {...iconProps} />;
    case "group":
      return <HugeiconsIcon icon={UserGroup02Icon} {...iconProps} />;
    case "calculator":
      return <HugeiconsIcon icon={Calculator01Icon} {...iconProps} />;
    case "check":
      return <HugeiconsIcon icon={CheckmarkCircle02Icon} {...iconProps} />;
    case "star":
      return <HugeiconsIcon icon={StarIcon} {...iconProps} />;
    case "alert":
      return <HugeiconsIcon icon={Shield02Icon} {...iconProps} />;
    case "clock":
      return <HugeiconsIcon icon={Clock01Icon} {...iconProps} />;
    case "calendar":
      return <HugeiconsIcon icon={Calendar01Icon} {...iconProps} />;
    case "edit":
      return <HugeiconsIcon icon={File02Icon} {...iconProps} />;
    case "refresh":
      return <HugeiconsIcon icon={ArrowRight01Icon} {...iconProps} />;
    case "sun":
      return <HugeiconsIcon icon={Sun01Icon} {...iconProps} />;
    case "snowflake":
      return <HugeiconsIcon icon={CloudSnowIcon} {...iconProps} />;
    case "heart":
      return <HugeiconsIcon icon={HeartCheckIcon} {...iconProps} />;
    case "tag":
      return <HugeiconsIcon icon={Tag01Icon} {...iconProps} />;
    case "shield":
      return <HugeiconsIcon icon={Shield02Icon} {...iconProps} />;
    case "language":
      return <HugeiconsIcon icon={LanguageCircleIcon} {...iconProps} />;
    default:
      return null;
  }
};

export default renderIcon;
