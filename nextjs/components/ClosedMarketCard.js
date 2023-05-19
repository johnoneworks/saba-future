import Link from "next/link";
import Img from "next/image";
import { ethers } from "ethers";

export default function ClosedMarketCard({
  id,
  title,
  outcome,
  yesBets,
  noBets,
  totalAmount,
  totalYesAmount,
  totalNoAmount,
  currentUser,
}) {
  const failIcon = <svg className="h-8 w-8 text-red-500" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
  const successIcon = <svg class="h-8 w-8 text-green-500" fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polyline points="20 6 9 17 4 12" /></svg>
  let titleWidth = "w-[calc(100%-72px)]";
  let win = false;
  let lost = false;
  if (yesBets.filter(bet => bet.user.toLowerCase() === currentUser?.toLowerCase()).length > 0) {
    if (outcome) {
      win = true;
    } else {
      lost = true;
    }
  }
  if (noBets.filter(bet => bet.user.toLowerCase() === currentUser?.toLowerCase()).length > 0) {
    if (outcome) {
      lost = true;
    } else {
      win = true;
    }
  }
  if (win && lost) {
    titleWidth = "w-[calc(100%-168px)]";
  } else if (win || lost) {
    titleWidth = "w-[calc(100%-120px)]";
  }
  const outcomeValue = outcome ? "Yes" : "No";
  const winnersCount = outcome ? yesBets.length : noBets.length;
  const bonus = outcome ? totalYesAmount : totalNoAmount;

  return (
    <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w md:my-2 md:px-2 md:w lg:w xl:w lg:w-full xl:w-full my-2">
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
            <span className={`text-sm break-words ${titleWidth}`}>{title}</span>
            {win ? successIcon : null}
            {lost ? failIcon : null}
          </div>
          <div className="flex flex-row flex-nowrap justify-between items-center">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Outcome</span>
              <span className="text-sm">
                {outcomeValue}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Winners Count</span>
              <span className="text-sm">
                {winnersCount}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Bonus</span>
              <span className="text-sm">
                {bonus.toString()}{" "}
                SURE
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
// ethers.utils.formatEther(balanceInWei);