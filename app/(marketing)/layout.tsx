import { Footer, Header } from "@/components/index";
import React from 'react'

interface Props {
    children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
                {children}
            </div>
            <Footer className="z-50" />
        </div>
    )
};

export default MarketingLayout