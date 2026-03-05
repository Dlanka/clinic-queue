import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "../ui";

export interface SidebarNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface SidebarNavGroup {
  label: string;
  items: readonly SidebarNavItem[];
}

interface SidebarProps {
  navGroups: readonly SidebarNavGroup[];
  isItemActive: (to: string) => boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ navGroups, isItemActive, mobileOpen, onCloseMobile }: SidebarProps) {
  const renderNavContent = (onItemClick?: () => void) =>
    navGroups.map((group, groupIndex) => (
      <div key={group.label}>
        <p className="px-2 pb-1.5 pt-3 text-2xs font-bold uppercase tracking-[0.14em] text-neutral-70">
          {group.label}
        </p>
        <nav className="space-y-1">
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.to);

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={onItemClick}
                className={`relative flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary-soft text-primary before:absolute before:bottom-[25%] before:left-0 before:top-[25%] before:w-0.5 before:rounded before:bg-primary before:shadow-[0_0_8px_var(--color-primary)]"
                    : "text-neutral-90 hover:bg-neutral-40 hover:text-neutral-100"
                }`}
              >
                <Icon size={16} />
                {item.label}
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-primary px-2 h-4 text-2xs font-extrabold text-neutral-0">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        {groupIndex < navGroups.length - 1 ? (
          <div className="my-3 h-px bg-neutral-variant-80/60" />
        ) : null}
      </div>
    ));

  return (
    <>
      <motion.aside
        className="fixed bottom-0 left-0 top-toolbar z-20 hidden w-sidebar overflow-y-auto bg-neutral-20 p-3 md:block"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.24 }}
      >
        {renderNavContent()}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-neutral-0/40 backdrop-blur-[1px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              className="fixed bottom-0 left-0 top-0 z-50 w-72 overflow-y-auto border-r border-neutral-variant-80 bg-neutral-20 p-4 md:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.22 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-95">Navigation</p>
                <Button
                  intent="ghost"
                  size="sm"
                  startIconName="x"
                  onClick={onCloseMobile}
                  aria-label="Close navigation"
                />
              </div>
              {renderNavContent(onCloseMobile)}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
