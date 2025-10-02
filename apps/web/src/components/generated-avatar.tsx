import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@delegatte/ui/components/avatar";
import { cn } from "@delegatte/ui/lib/utils";

interface GeneratedAvatarProps {
  className?: string;
  seed: string;
  variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
  className,
  seed,
  variant,
}: GeneratedAvatarProps) => {
  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt={"Avatar"} />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
