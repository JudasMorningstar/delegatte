import Link from "next/link";

import { cn } from "@delegatte/ui/lib/utils";
import { Shell } from "@/components/shell";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@delegatte/ui/components/card";

export function AuthCard({
  title,
  description,
  children,
  className,
  ...props
}: {
  title: string;
  description: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <Shell className={cn("max-w-lg", className)} {...props}>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icons.logo className="size-4" />
          </div>
          Delegatte
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our{" "}
          <Link href="/pages/terms">Terms of Service</Link> and{" "}
          <Link href="pages/privacy">Privacy Policy</Link>.
        </div>
      </div>
    </Shell>
  );
}
