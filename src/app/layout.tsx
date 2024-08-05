import Auth from "@/components/auth/Auth";
import { determinationFont, sairaFont } from "@/configs/fonts";
import "@/styles/globals.css";
import { cn } from "@/utils";
import dynamic from "next/dynamic";
import { Providers } from "./provider";
import Layout from "@/components/layout";
import Head from "next/head";

const ConnectWalletModal = dynamic(
	() => import("@/components/ConnectWalletModal"),
	{
		ssr: false,
	}
);

const NetworkModal = dynamic(() => import("@/components/auth/NetworkModal"), {
	ssr: false,
});

export const generateMetadata = () => {
	return {
		description:
			"Hakifi is a hedging protocol to provide insurance solutions that protects users assets from market fluctuations. Users can easily choose digital assets and receive personalized suggestions for opening an insurance contract with Hakifi. Currently, the supported insurance coverage list includes over 150 listed assets.",
		title:
			"Hakifi | The first asset value insurance protocol using Blockchain technology",
	};
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Head>
				<link rel="icon" href="./icon.ico" sizes="any" />
			</Head>
			<body
				className={cn(
					sairaFont.variable,
					determinationFont.variable,
					"font-saira text-support-white bg-background-tertiary"
				)}
			>
				<Providers>
					<NetworkModal />
					<ConnectWalletModal />
					<Auth />
					<Layout>{children}</Layout>
				</Providers>
			</body>
		</html>
	);
}
