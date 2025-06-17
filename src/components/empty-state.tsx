import Image from "next/image";

export const EmptyState = () => {
  return (
    <div className="mt-32 flex h-full flex-col items-center justify-center space-y-1 text-center">
      <Image src="/favicon.ico" alt="Turtle Chat" width={64} height={64} />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-neutral-900">Turtle Chat</h2>
        <p className="max-w-md text-sm text-neutral-600">
          Ask questions, get help, or just chat!
        </p>
      </div>
    </div>
  );
};
