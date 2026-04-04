import type { Metadata } from 'next';
import { PrivacyPolicyPage } from './privacy-policy-page';

export const metadata: Metadata = {
  title: 'Privacy Policy — NeuroVault',
  description: 'NeuroVault Privacy Policy: Learn how we collect, use, and protect your data.',
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
