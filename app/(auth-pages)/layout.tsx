export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 md:gap-20 items-start mx-auto">{children}</div>
  );
}
