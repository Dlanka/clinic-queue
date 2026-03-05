import {
  Activity,
  CalendarDays,
  Bell,
  CalendarClock,
  ClipboardList,
  Check,
  House,
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
  calendarDays: CalendarDays,
  bell: Bell,
  calendarClock: CalendarClock,
  clipboardList: ClipboardList,
  check: Check,
  home: House,
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
