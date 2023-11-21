import Script from "next/script";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" />
    </>
  );
}
