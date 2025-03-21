import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              aria-label="Sign in"
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              aria-label="Sign up"
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden md:inline">Hey, {user.email}!</span>
      <Button asChild size="sm" variant={"link"}>
        <Link href="/protected/estimates">Estimates</Link>
      </Button>
      <form action={signOutAction}>
        <Button aria-label="Sign out" type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
      <ThemeSwitcher />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button aria-label="Sign in" asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <ThemeSwitcher />
    </div>
  );
}
