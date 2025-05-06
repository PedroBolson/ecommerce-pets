import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Currency = {
    code: string;
    name: string;
    flag: string;
    symbol: string;
    rate: number;
};

export const currencies: Currency[] = [
    { code: 'VND', name: 'Vietnam', flag: '🇻🇳', symbol: '₫', rate: 1 },
    { code: 'BRL', name: 'Brasil', flag: '🇧🇷', symbol: 'R$', rate: 0.00022 }, // 1 VND ≈ 0.00022 BRL
    { code: 'USD', name: 'USA', flag: '🇺🇸', symbol: '$', rate: 0.000039 },   // 1 VND ≈ 0.000039 USD
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€', rate: 0.000034 }   // 1 VND ≈ 0.000034 EUR
];

// Interface do contexto
interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertPrice: (priceInVND: number | string) => number;
    formatPrice: (price: number | string) => string;
}

// Criação do contexto
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Provider do contexto
export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>(currencies[0]); // VND como padrão

    // Função para converter preço de VND para a moeda selecionada
    const convertPrice = (priceInVND: number | string): number => {
        const numericPrice = typeof priceInVND === 'string' ? parseFloat(priceInVND) : priceInVND;
        return numericPrice * currency.rate;
    };

    // Função para formatar o preço de acordo com a moeda
    const formatPrice = (price: number | string): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        const convertedPrice = numericPrice * currency.rate;

        return new Intl.NumberFormat(currency.code === 'VND' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: currency.code === 'VND' ? 0 : 2,
            maximumFractionDigits: currency.code === 'VND' ? 0 : 2,
        })
            .format(convertedPrice)
            .replace(currency.code, currency.symbol)
            .trim();
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency,
            convertPrice,
            formatPrice
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};