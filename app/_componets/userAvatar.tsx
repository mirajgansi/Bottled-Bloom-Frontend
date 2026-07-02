import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserAvatar({
  username,
  avatar,
}: {
  username?: string;
  avatar?: string;
}) {
  const letter = (username?.charAt(0) || "?").toUpperCase();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatar} alt={username} />
      <AvatarFallback className=" text-black text-xs font-semibold">
        {letter}
      </AvatarFallback>
    </Avatar>
  );
}
