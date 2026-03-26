"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Command } from "lucide-react";

import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { navConfig } from "@/lib/nav-config";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const userInitials =
    user?.email
      ?.split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2) || "U";

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
      toast.success("Logout berhasil");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout gagal");
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* image logo */}
        <Image src="/logo_mbg.png" alt="Logo" width={150} height={150} className="mt-2 h-auto "/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 mt-4 space-y-3 ">
          {navConfig.mainNav.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  render={
                    <Link href={item.url}>
                      <item.icon className="size-6" />
                      <span className="text-md " >{item.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="flex flex-col gap-2">
          {/* USER INFO */}
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user?.displayName || user?.email?.split("@")[0]}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
