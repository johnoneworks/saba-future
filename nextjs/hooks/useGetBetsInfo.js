import syncMarketTickets from "@/service/market/getMarketTickets";
import { useAccountStore } from "@/store/useAccountStore";
import { useMarketsStore } from "@/store/useMarketsStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useCallback, useEffect } from "react";

const useGetBetsInfo = () => {
    const { setYesInfo, setNoInfo } = useMarketsStore();
    const { token } = useAccountStore();
    const { currentMarketID } = useMenuStore();

    const updateBetsInfo = useCallback(
        async (currentMarketID) => {
            try {
                let response = await syncMarketTickets({
                    marketId: Number(currentMarketID),
                    token: token
                });
                let yesBets = [];
                let noBets = [];
                if (!!response && response.ErrorCode === 0) {
                    response.Result.Tickets.forEach((ticket) => {
                        if (ticket.BetTypeName === "Yes") {
                            yesBets.push({
                                nickName: ticket.NickName,
                                time: ticket.StartTime,
                                amount: ticket.Stake
                            });
                        } else if (ticket.BetTypeName === "No") {
                            noBets.push({
                                nickName: ticket.NickName,
                                time: ticket.StartTime,
                                amount: ticket.Stake
                            });
                        }
                    });
                }
                setYesInfo(yesBets);
                setNoInfo(noBets);
            } catch (error) {
                console.error(`Error getting bets, ${error}`);
            }
        },
        [currentMarketID]
    );

    useEffect(() => {
        if (currentMarketID) {
            updateBetsInfo(currentMarketID);
        }
    }, [currentMarketID, updateBetsInfo]);

    return { updateBetsInfo };
};

export default useGetBetsInfo;
