import { WalletProvider } from '@suiet/wallet-kit';
import { ReactNode } from 'react';
import '@suiet/wallet-kit/style.css';

export function AppWalletProvider({ children }: { children: ReactNode }) {
    return (
        <WalletProvider>
            {children}
        </WalletProvider>
    );
}
