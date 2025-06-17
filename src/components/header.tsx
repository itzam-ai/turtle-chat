import { LogOut } from "lucide-react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Header = ({ session }: { session: Session }) => {
  return (
    <header className="absolute top-4 right-4 left-4 z-10">
      <div className="mx-auto flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer border-none shadow-none ring-0 transition-opacity hover:opacity-80 focus:ring-0 active:ring-0 active:ring-offset-0">
            <div className="flex items-center gap-2 px-2 py-1">
              <Avatar className="size-5">
                <AvatarImage
                  src={session.user?.image ?? ""}
                  alt={session.user?.name ?? ""}
                />
                <AvatarFallback className="bg-neutral-200 text-neutral-700">
                  {session.user?.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm text-neutral-700 sm:block">
                {session.user?.name}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => void signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
