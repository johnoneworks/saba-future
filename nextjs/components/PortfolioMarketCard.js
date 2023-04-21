import Img from "next/image";

export default function PortfolioMarketCard({
    title,
    totalYesAmount,
    totalNoAmount
}) {
    return (
        <div className="w-full overflow-hidden my-2">
            <div className="flex flex-col border border-gray-300 rounded-lg p-5 hover:border-blue-700 cursor-pointer">
                <div className="flex flex-row space-x-5 pb-4">
                    <div className="h-w-15">
                        <Img
                            src="/placeholder.jpg"
                            alt="placeholder"
                            className="rounded-full"
                            width={55}
                            height={55}
                        />
                    </div>
                    <span className="text-lg font-semibold">{title}</span>
                </div>
                <div className="flex flex-row flex-nowrap justify-between items-center">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500 font-light">Outcome</span>
                        <span className="text-base">{totalYesAmount ? "YES" : "NO"}</span>{/*TODO: this seems wrong */}
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500 font-light">
                            Amount Added
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}