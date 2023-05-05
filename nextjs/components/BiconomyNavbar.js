import Link from "next/link";

export default function BiconomyNavbar() {
    return (
        <>
            <nav className="w-full h-16 mt-auto max-w-5xl">
                <div className="flex flex-row justify-between items-center h-full">
                    <Link href="/" passHref>
                        <span className="font-semibold text-xl cursor-pointer">
                            Prediction World
                        </span>
                    </Link>
                </div>
            </nav>
        </>
    );
}