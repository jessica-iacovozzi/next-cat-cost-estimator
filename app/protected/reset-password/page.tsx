import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4" aria-label="Reset Password Form">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label id="password-label" htmlFor="password">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
        labelledBy="password-label"
        describedBy="password-help"
        aria-label="New Password"
        aria-required
      />
      <p id="password-help" className="sr-only">Enter your new password to reset your password.</p>
      <Label id="confirm-password-label" htmlFor="confirmPassword">Confirm new password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm new password"
        required
        labelledBy="confirm-password-label"
        describedBy="confirm-password-help"
        aria-label="Confirm New Password"
        aria-required
      />
      <p id="confirm-password-help" className="sr-only">Confirm your new password to reset your password.</p>
      <SubmitButton formAction={resetPasswordAction} aria-label="Reset Password">
        Reset password
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
