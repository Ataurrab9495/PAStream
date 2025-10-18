import { LoaderIcon } from "lucide-react";


const ChatLoader = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <LoaderIcon className="animate-spin size-10 text-primary"/>
      <p className="mt-4 text-center text-lg font-mono max-w-md">Connect kr rahe hai bhaiya , thoda wait toh karo...</p>
    </div>
  );
};

export default ChatLoader;