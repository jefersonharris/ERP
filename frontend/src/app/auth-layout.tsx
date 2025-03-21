export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}
