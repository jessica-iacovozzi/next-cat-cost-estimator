import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const searchParams = await props.searchParams;
  const { error, success, returnTo } = searchParams;
  
  let message: Message | null = null;
  if (error) {
    message = { error: decodeURIComponent(error as string) };
  } else if (success) {
    message = { success: decodeURIComponent(success as string) };
  }

  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label id="email-label" htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required labelledBy="email-label" describedBy="email-help" aria-required />
        <p id="email-help" className="sr-only">Enter your email to sign in.</p>
        <div className="flex justify-between items-center">
          <Label id="password-label" htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
          labelledBy="password-label"
          describedBy="password-help"
          aria-required
        />
        <p id="password-help" className="sr-only">Enter your password to sign in.</p>
        {returnTo && (
          <Input type="hidden" name="returnTo" value={returnTo as string} />
        )}
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        {message && <FormMessage message={message} />}
      </div>
    </form>
  );
}
