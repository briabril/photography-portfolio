import type { Metadata } from "next";
 /** evita que Google (u otros buscadores) indexen /panel/* */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}