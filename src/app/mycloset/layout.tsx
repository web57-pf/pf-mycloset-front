export default function myClosetLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        {children}
      </div>
    );
  }
  