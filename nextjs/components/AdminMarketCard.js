import { TestDataMark } from "@/components/TestDataMark/TestDataMark";
import { BET_TYPE } from "@/constants/Constant";
import { API_RESOLVE_MARKET, API_SUSPEND_MARKET } from "@/constants/api";
import useGetMarkets from "@/hooks/useGetMarkets";
import baseAxios from "@/service/baseAxios";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { useState } from "react";
import { AdminConfirmPage } from "./ConfirmPage/AdminConfirmPage";

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

export default function AdminMarketCard({ id, market }) {
    const { setIsPageLoading } = useLoadingStore();
    const [selectedResolve, setSelectedResolve] = useState(null);
    const { updateMarkets } = useGetMarkets();
    const { token } = useAccountStore();
    const router = useRouter();
    const isTest = market.isTest;

    const onCancelResolve = () => {
        setSelectedResolve(null);
    };

    const onConfirmResolve = async () => {
        if (selectedResolve === null) return;
        try {
            setIsPageLoading(true);
            await handleResolveMarket(selectedResolve);
            alert("Success!");
        } catch (err) {
            console.error(err);
            alert("Error!!");
        } finally {
            setIsPageLoading(false);
            setSelectedResolve(null);
        }
    };

    const handleSuspend = async (isSuspended) => {
        try {
            setIsPageLoading(true);
            const response = await baseAxios({
                method: "POST",
                url: API_SUSPEND_MARKET,
                token: token,
                data: {
                    Payload: {
                        MarketId: id,
                        IsSuspend: isSuspended
                    }
                }
            });
            if (response && response.ErrorCode === 0) {
                updateMarkets();
            } else {
                throw new Error("Error suspend market");
            }
        } catch (err) {
            console.log("%c⧭ Error suspend market", "color: #917399", err);
        } finally {
            setIsPageLoading(false);
        }
    };

    const handleResolveMarket = async (selectedResolve) => {
        try {
            setIsPageLoading(true);
            const response = await baseAxios({
                method: "POST",
                url: API_RESOLVE_MARKET,
                token: token,
                data: {
                    Payload: {
                        MarketId: id,
                        Outcome: selectedResolve
                    }
                }
            });
            if (response && response.ErrorCode === 0) {
                updateMarkets();
            } else {
                throw new Error("Error resolve market");
            }
        } catch (err) {
            console.log("%c⧭ Error resolve market", "color: #917399", err);
        } finally {
            setIsPageLoading(false);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        router.push({
            pathname: `/admin/${id}`
        });
        return false;
    };

    return (
        <>
            <div className="w-full overflow-hidden my-2" style={{ backgroundColor: "#fff" }}>
                <div className="flex flex-col border border-gray-300 rounded-lg p-5 hover:border-blue-700 cursor-pointer">
                    {isTest && <TestDataMark />}
                    <div className="flex flex-row space-x-5 pb-4">
                        <Tooltip title="Edit">
                            <IconButton className="float-right" color="primary" aria-label="go to edit" onClick={handleEdit} fontSize="small">
                                <BorderColorOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                        <div className="h-w-15">
                            <CustomAvatar>
                                <Box component="img" src={market.imageHash} alt="marketImage" sx={{ width: 55, height: 55 }} />
                            </CustomAvatar>
                        </div>
                        <span className="text-lg font-semibold w-full">{market.question}</span>
                        {!market.hasResolved &&
                            (market.isSuspended ? (
                                <IconButton className="h-w-15 text-right" color="primary" onClick={() => handleSuspend(false)}>
                                    <PlayCircleIcon />
                                </IconButton>
                            ) : (
                                <IconButton className="h-w-15 text-right" color="primary" onClick={() => handleSuspend(true)}>
                                    <PauseCircleIcon />
                                </IconButton>
                            ))}
                    </div>
                    <div className="flex flex-row flex-nowrap justify-between items-center">
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs text-gray-500 font-light">Total Liquidity</span>
                            <span className="text-base">{`${market.totalAmount} SURE`}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs text-gray-500 font-light">Ending In</span>
                            <span className="text-base">{market.endTimestamp}</span>
                        </div>
                    </div>
                    <div className="flex flex-row flex-nowrap justify-between items-center">
                        <div className="flex flex-row space-x-2 items-end">
                            <button className="py-1 px-2 rounded-lg bg-blue-700 text-white" onClick={() => setSelectedResolve(BET_TYPE.YES)}>
                                Resolve YES
                            </button>
                            <button className="py-1 px-2 rounded-lg bg-blue-700 text-white" onClick={() => setSelectedResolve(BET_TYPE.NO)}>
                                Resolve No
                            </button>
                            <button className="py-1 px-2 rounded-lg bg-blue-700 text-white" onClick={() => setSelectedResolve(BET_TYPE.DRAW)}>
                                Resolve Draw
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AdminConfirmPage
                title={market.question}
                onClose={onCancelResolve}
                open={!!selectedResolve}
                onConfirm={onConfirmResolve}
                selectedResolve={selectedResolve}
            />
        </>
    );
}
