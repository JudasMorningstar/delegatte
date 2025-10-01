"use client";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </section>
  );
}
