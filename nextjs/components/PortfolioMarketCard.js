import Link from "next/link";
import Img from "next/image";
import moment from "moment";


export default function PortfolioMarketCard({
  id,
  title,
  betType,
  amount,
  totalYesAmount,
  totalNoAmount,
  timestamp,
  endTimestamp,
  hasResolved,
  outcome,
}) {

  let bgColor = "";
  if (hasResolved) {
    bgColor = outcome === betType
      ? "bg-sky-500/10"
      : "bg-pink-500/10";
  }

  return (
    <div className="w-full overflow-hidden my-2">
      <div className={`${bgColor} flex flex-col border border-gray-300 rounded-lg p-5 hover:border-blue-700 cursor-pointer`}>
        <Link href={`/market/${id}`} passHref>
          <div className="flex flex-row space-x-5 pb-4">

            <div className="w-15">
              <Img
                src="/placeholder.jpg"
                alt="placeholder"
                className="rounded-full"
                width={55}
                height={55}
              />
            </div>
            <div className="flex w-[calc(100%+15rem)]">
              <span className="w-4/5 text-lg font-semibold">{title}</span>

              <span className="flex w-1/5 justify-end">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-gray-500 font-light">
                    Your Bet
                  </span>
                  <span className="bg-green-500 text-white w-24 pl-3 pr-3">
                    <span className="font-bold">{betType}:</span>
                    {" "}
                    {amount}
                  </span>
                </div>
              </span>
            </div>
          </div>
          <div className="flex flex-row flex-nowrap justify-between items-center">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500 font-light">Outcome</span>
              <span className="text-base">{hasResolved ? outcome.toString() : "In progress"}</span>{/*TODO: this seems wrong */}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">
                Amount Added
              </span>
              <span className="text-base">
                {totalYesAmount.toString()}{" SURE on Yes"}
                <hr />
                {totalNoAmount.toString()}{" SURE on No"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Added On</span>
              <span className="text-base">
                {endTimestamp
                  ? moment.unix(timestamp / 1000).format("MMMM D, YYYY")
                  : "N/A"
                }
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Ending In</span>
              <span className="text-base">
                {endTimestamp
                  ? moment.unix(endTimestamp / 1000).format("MMMM D, YYYY")
                  : "N/A"
                }
              </span>
            </div>
            {/* <div className="flex flex-col space-y-1 items-end">
              <div className="py-2 px-8 rounded-lg bg-blue-700 text-white">
                Trade
              </div>
            </div> */}
          </div>
        </Link>
      </div>
    </div>
  );
}