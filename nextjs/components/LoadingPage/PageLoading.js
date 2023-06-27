import { LoadingContext } from "@/contexts/LoadingContext";
import { useContext } from "react";

export default function PageLoading() {
    const { isPageLoading } = useContext(LoadingContext);
    return (
        <div
            className={`${
                isPageLoading ? "opacity-100" : "opacity-0 pointer-events-none"
            } modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-10 text-blue-500`}
        >
            <div
                className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] z-10"
                role="status"
            ></div>
            <div className="opacity-50 bg-gray-900 fixed w-full h-full top-0 left-0 flex items-center justify-center z-10"></div>
        </div>
    );
}
