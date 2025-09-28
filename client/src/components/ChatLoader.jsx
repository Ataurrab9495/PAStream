import { LoaderIcon } from "lucide-react";


const ChatLoader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <LoaderIcon className="animate-spin size-10 text-primary"/>
      <p className="mt-4 text-center text-lg font-mono">Connect kr rahe hai bhaiya , thoda wait toh karo...</p>
    </div>
  );
};

export default ChatLoader;