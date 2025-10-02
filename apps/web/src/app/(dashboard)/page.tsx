"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@delegatte/ui/components/button";

export default function StudioPage() {
  // const router = useRouter();
  // const { data: session, isPending: isSessionLoading } =
  //   authClient.useSession();

  // // Handle session redirect in useEffect to avoid render-time navigation
  // useEffect(() => {
  //   if (!isSessionLoading && !session) {
  //     router.push("/sign-in");
  //   } else {
  //     router.push("/test");
  //   }
  // }, [session, isSessionLoading]);

  // // Handle session loading state
  // if (isSessionLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <LoadingState
  //         title="Checking authentication..."
  //         description="Please wait"
  //       />
  //     </div>
  //   );
  // }

  // // Show loading while redirecting (don't render the rest if no session)
  // if (!session) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <LoadingState title="Redirecting..." description="Please wait" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Apps/Web</h1>
        <p className="text-center">You are logged in!</p>
        <Button onClick={() => authClient.signOut()} className="px-4 py-2">
          Logout
        </Button>
      </div>
    </div>
  );
}
