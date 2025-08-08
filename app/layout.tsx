export const metadata = {
  title: "BrickBuilder 3D",
  description: "Create amazing LEGO-style builds in 3D",
  icons: {
    icon: '/icon.svg',
  }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0f0f23", color: "#e5e7eb" }}>
        {children}
      </body>
    </html>
  );
}