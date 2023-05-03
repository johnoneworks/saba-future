import dynamic from "next/dynamic";
import { Suspense } from "react";

export default function BiconomyTest() {
    const SocialLoginDynamic = dynamic(
        () => import("../components/SmartContractWallet").then((res) => res.default),
        {
            ssr: false,            
        }
    );

    return (
        <div>
           <Suspense fallback={<div>Loading...</div>}>
                <SocialLoginDynamic />
            </Suspense> 
        </div>
    );
}