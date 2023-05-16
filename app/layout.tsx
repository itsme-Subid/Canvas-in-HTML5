import { Poppins } from "next/font/google";
import StyledComponentsRegistry from "./lib/registry";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-inter",
  style: ["normal", "italic"],
  weight: ["200", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Canvas",
  description: "A simple canvas app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={poppins.variable}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
