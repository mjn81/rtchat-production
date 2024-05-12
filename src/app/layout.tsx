import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers';
import { cn, constructMetaData } from "@/lib/utils";

const inter = Roboto({
	subsets: ['latin'],
	weight: ['300', '400', '500', '700', '900'],
});

export const metadata: Metadata = constructMetaData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<html lang="en">
			<body className={cn(inter.className, 'antialiased font-sans w-screen overflow-x-hidden')}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
