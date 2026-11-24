import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop & Services • SANAM Discord',
  description: 'Official SANAM Server Promo, Event Management, and Custom Bot Development services.',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
