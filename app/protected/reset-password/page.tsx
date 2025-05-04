import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

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
      <VisuallyHidden id="password-help">Enter your new password to reset your password.</VisuallyHidden>
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
      <VisuallyHidden id="confirm-password-help">Confirm your new password to reset your password.</VisuallyHidden>
      <SubmitButton formAction={resetPasswordAction} aria-label="Reset Password">
        Reset password
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
