import type { Session } from "next-auth";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Message = ({
  msg,
  session,
}: {
  msg: { role: "user" | "assistant"; content: string };
  session: Session;
}) => {
  return (
    <div
      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {msg.role === "assistant" && (
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <Image
              src="/favicon.ico"
              alt="Turtle Chat"
              width={24}
              height={24}
            />
          </div>
        </div>
      )}
      <div
        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
          msg.role === "user"
            ? "bg-green-600 text-white"
            : "border border-neutral-200 bg-white text-neutral-900"
        }`}
      >
        <p className="text-sm">{msg.content}</p>
      </div>
      {msg.role === "user" && (
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user?.image ?? ""}
              alt={session.user?.name ?? ""}
            />
            <AvatarFallback className="bg-neutral-200 text-xs text-neutral-700">
              {session.user?.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};
