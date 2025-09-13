import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Spinner } from "@heroui/spinner";
import { RobotIcon } from "@/components/icons";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar
        size="sm"
        icon={<RobotIcon size={16} />}
        name="AI"
        className="bg-secondary text-secondary-foreground flex-shrink-0"
      />
      <Card className="bg-content1 border border-divider shadow-sm max-w-[65%] lg:max-w-[50%]">
        <CardBody className="p-3">
          <div className="flex items-center gap-2">
            <Spinner size="sm" color="primary" />
            <span className="text-sm opacity-70">AI is typing...</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
