import Link from "next/link";
import Img from "next/image";

export default function MarketCard({ id, title }) {
    return (
        <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/3 md:my-2 md:px-2 md:w-1/3 lg:w-1/3 xl:w-1/3 my-2">
            <Link href={`/market/${id}`} passHref>
                <div className="flex flex-col border border-gray-300 rounded-lg p-3 hover:border-blue-700 cursor-pointer">
                    <div className="flex flex-row space-x-5 pb-8">
                        <div className="w-12  h-w-12 ">
                            <Img
                                src="/placeholder.jpg"
                                alt="placeholder"
                                className="rounded-full"
                                width={100}
                                height={100}
                            />
                        </div>
                        <span className="text-sm">{title}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}