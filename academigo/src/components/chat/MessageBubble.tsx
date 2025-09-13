import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Message } from "@/types";
import { RobotIcon } from "@/components/icons";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 mb-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar
        size="sm"
        icon={!message.isUser ? <RobotIcon size={16} /> : undefined}
        name={message.isUser ? "You" : "AI"}
        className={`${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} flex-shrink-0`}
      />
      <Card
        className={`max-w-[65%] lg:max-w-[50%] ${
          message.isUser 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'bg-content1 border border-divider shadow-sm'
        }`}
      >
        <CardBody className="p-3">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          <span className="text-xs opacity-70 mt-2 block">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </CardBody>
      </Card>
    </div>
  );
};
