import { Activity } from "lucide-react";
import { Avatar, Chip, IconButton, Input } from "../ui";

interface ToolbarProps {
  onOpenMenu: () => void;
  onOpenProfile: () => void;
  profileLabel: string;
  tenantName: string;
}

export function Toolbar({ onOpenMenu, onOpenProfile, profileLabel, tenantName }: ToolbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-toolbar items-center gap-3 bg-neutral-20 px-0 pr-3 backdrop-blur-sm md:pr-6">
      <div className="flex h-toolbar  items-center justify-center mx-4">
        <div className="flex  border-2 border-primary rounded-full overflow-hidden ">
          <div className="text-primary px-2 py-1 flex items-center justify-center">
            <Activity size={16} strokeWidth={3} />
          </div>
          <span className="flex items-center justify-center px-2 text-neutral-0 bg-primary font-extrabold text-base">
            Zynic
          </span>
        </div>
      </div>

      <div className="ml-auto hidden items-center gap-3 md:flex">
        <Input
          placeholder="Search patients, tickets"
          size="sm"
          rounded="full"
          containerClassName="w-[240px]"
          startIconName="search"
          shortcutKey="Ctrl+K"
        />
        <Chip tone="tertiary" label={tenantName} iconName="home" />
        <Chip tone="success" withDot label="Online" />
        <IconButton iconName="bell" aria-label="Notifications" />
        <Avatar
          as="button"
          label={profileLabel}
          size="sm"
          aria-label="Open profile"
          onClick={onOpenProfile}
        />
      </div>

      <div className="ml-auto md:hidden">
        <IconButton
          iconName="menu"
          tone="primary"
          onClick={onOpenMenu}
          aria-label="Open navigation"
        />
      </div>
    </header>
  );
}
