// lib/constants.ts
import {
  Send,
  BookOpenText,
  Calendar,
  LifeBuoy,
  LucideIcon,
  Settings,
  Contact,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export interface NavItemWithChildren extends NavItem {
  items: {
    title: string;
    url: string;
  }[];
}

export interface ProjectNavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export const dashboardNavItems = {
  navMain: [
    // {
    //   title: "Overview",
    //   url: "/dashboard/:slug",
    //   icon: Home,
    // },
    {
      title: "Calendar",
      url: ":slug/calendar",
      icon: Calendar,
    },
    {
      title: "Contacts",
      url: ":slug/contacts",
      icon: Contact,
    },

    {
      title: "Resources",
      url: ":slug/resources",
      icon: BookOpenText,
    },

    {
      title: "Settings",
      url: ":slug/settings",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Notification",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Workspace",
          url: "#",
        },
      ],
    },
  ] as Array<NavItem | NavItemWithChildren>,

  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ] as NavItem[],
};

export const generateSecondaryItems = (slug: string) => {
  if (!slug || typeof slug !== "string") {
    throw new Error("Invalid slug provided to generateSecondaryItems");
  }
  return dashboardNavItems.navSecondary.map((item) => {
    const url = item.url.replace(":slug", slug);
    return { ...item, url };
  });
};

export const generateDashboardNavItems = (slug: string) => {
  if (!slug || typeof slug !== "string") {
    throw new Error("Invalid slug provided to generateSecondaryItems");
  }
  return dashboardNavItems.navMain.map((item) => {
    const url = item.url.replace(":slug", slug);
    if ("items" in item) {
      return {
        ...item,
        url,
        items: item.items.map((subItem) => ({
          ...subItem,
          url: subItem.url.replace(":slug", slug),
        })),
      };
    }
    return { ...item, url };
  });
};
