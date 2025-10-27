export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-grow flex-col items-center justify-start gap-2 p-8 pb-20 font-sans sm:p-15">
      {children}
    </main>
  );
}
