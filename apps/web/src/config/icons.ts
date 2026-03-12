import {
  Activity,
  ArrowRight,
  CalendarDays,
  Bell,
  CalendarClock,
  ClipboardList,
  Check,
  House,
  LockKeyhole,
  Mail,
  Menu,
  Plus,
  Search,
  UserRound,
  X,
  CircleEllipsis,
  Ellipsis,
  EllipsisVertical,
  type LucideIcon
} from "lucide-react";

export const iconMap = {
  activity: Activity,
  arrowRight: ArrowRight,
  calendarDays: CalendarDays,
  bell: Bell,
  calendarClock: CalendarClock,
  clipboardList: ClipboardList,
  check: Check,
  home: House,
  lock: LockKeyhole,
  mail: Mail,
  menu: Menu,
  plus: Plus,
  search: Search,
  user: UserRound,
  x: X,
  circleEllipsis: CircleEllipsis,
  ellipsis: Ellipsis,
  ellipsisVertical: EllipsisVertical
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;
