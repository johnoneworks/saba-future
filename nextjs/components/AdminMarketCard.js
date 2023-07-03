import { predictionWorldAddress } from "@/config";
import { BACKUP_IMAGE, BET_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { convertBigNumberToDate } from "@/utils/ConvertDate";
import { Avatar, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useContext } from "react";

/**
 * TODO:
 * 1. 畫面優化
 * 2. distributeWithGasless 行為拆出去做
 */

const CustomAvatar = styled(Avatar)({
    borderRadius: "4px",
    marginRight: "4px",
    width: "56px",
    height: "56px"
});

export default function PortfolioMarketCard({ id, market }) {
    const { smartAccount, predictionWorldInterface } = useContext(BiconomyAccountContext);
    const isResolved = market.hasResolved;
    const outcome = market.outcome ? BET_TYPE.YES : BET_TYPE.NO;

    const onYes = async () => {
        try {
            await distributeWithGasless(true);
            alert("Success!");
        } catch (err) {
            console.error(err);
            alert("Error!!");
        }
    };
    const onNo = async () => {
        try {
            await distributeWithGasless(false);
            alert("Success!");
        } catch (err) {
            console.error(err);
            alert("Error!!");
        }
    };

    const distributeWithGasless = async (result) => {
        let transactions = [];
        const transactionData = predictionWorldInterface.encodeFunctionData("distributeWinningAmount", [id, result]);

        transactions = [
            {
                to: predictionWorldAddress,
                data: transactionData
            }
        ];

        const txResponse = await smartAccount.sendTransactionBatch({ transactions });
        console.log("UserOp hash", txResponse.hash);
        const txReceipt = await txResponse.wait();
        console.log("Tx hash", txReceipt.transactionHash);
    };

    return (
        <div className="w-full overflow-hidden my-2" style={{ backgroundColor: isResolved ? "#E4E9F0" : "#fff" }}>
            <div className="flex flex-col border border-gray-300 rounded-lg p-5 hover:border-blue-700 cursor-pointer">
                <div className="flex flex-row space-x-5 pb-4">
                    <div className="h-w-15">
                        <CustomAvatar>
                            <Box
                                component="img"
                                src={market.imageHash}
                                onError={(e) => {
                                    e.target.src = { BACKUP_IMAGE }; // 設置備用圖片的 URL
                                }}
                                alt="marketImage"
                                sx={{ width: 55, height: 55 }}
                            />
                        </CustomAvatar>
                    </div>
                    <span className="text-lg font-semibold">{market.question}</span>
                </div>
                <div className="flex flex-row flex-nowrap justify-between items-center">
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500 font-light">Total Liquidity</span>
                        <span className="text-base">{`${market.totalAmount} SURE`}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500 font-light">Ending In</span>
                        <span className="text-base">{convertBigNumberToDate(market.endTimestamp)}</span>
                    </div>
                    {!isResolved ? (
                        <div className="flex flex-row space-x-2 items-end">
                            <button className="py-1 px-2 rounded-lg bg-blue-700 text-white" onClick={onYes}>
                                Resolve YES
                            </button>
                            <button className="py-1 px-2 rounded-lg bg-blue-700 text-white" onClick={onNo}>
                                Resolve No
                            </button>
                        </div>
                    ) : (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", mb: "3px", lineHeight: 1, pt: "5px" }}>
                                Outcome
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: market.hasResolved ? (outcome === BET_TYPE.YES ? "#3FB06B" : "#E84D4D") : "#1A84F2", fontWeight: "bold" }}
                            >
                                {market.hasResolved ? outcome.toString() : "In progress"}
                            </Typography>
                        </Box>
                    )}
                </div>
            </div>
        </div>
    );
}
