declare module "lucide-react" {
  import * as React from "react";
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    color?: string;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const LayoutDashboard: LucideIcon;
  export const ArrowLeftRight: LucideIcon;
  export const PieChart: LucideIcon;
  export const WalletCards: LucideIcon;
  export const User: LucideIcon;
  export const Plus: LucideIcon;
  export const LogOut: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const X: LucideIcon;
  export const ArrowDownLeft: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Calendar: LucideIcon;
  export const Tag: LucideIcon;
  export const FileText: LucideIcon;
  export const Check: LucideIcon;
  export const Trash2: LucideIcon;
  export const Edit2: LucideIcon;
  export const Search: LucideIcon;
  export const Filter: LucideIcon;
  export const ArrowUpDown: LucideIcon;
  export const Receipt: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const TrendingDown: LucideIcon;
  export const BarChart3: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Mail: LucideIcon;
  export const Database: LucideIcon;
  export const Copy: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Shield: LucideIcon;
  export const Zap: LucideIcon;
  export const Wallet: LucideIcon;
  export const Lock: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Info: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Code2: LucideIcon;

  const icons: Record<string, LucideIcon>;
  export default icons;
}
