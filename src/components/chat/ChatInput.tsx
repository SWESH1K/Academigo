import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { SendIcon } from "@/components/icons";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-divider bg-content1">
      <form onSubmit={handleSubmit} className="flex gap-3 p-4 max-w-6xl mx-auto">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1"
          disabled={isLoading}
          size="lg"
          variant="bordered"
          classNames={{
            input: "bg-transparent",
            inputWrapper: "bg-background border-divider hover:border-primary focus-within:!border-primary"
          }}
        />
        <Button
          type="submit"
          color="primary"
          isDisabled={!message.trim() || isLoading}
          isLoading={isLoading}
          size="lg"
          className="px-4"
          endContent={!isLoading ? <SendIcon size={16} /> : undefined}
        >
          {isLoading ? "" : "Send"}
        </Button>
      </form>
    </div>
  );
};
