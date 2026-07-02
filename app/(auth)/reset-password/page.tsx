import ResetPasswordForm from "../_componets/resetPasswordForm";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {


  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
}
