import { AdminHeader } from "@/components/Header/AdminHeader";
import { predictionWorldAddress } from "@/config";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { MarketContext } from "@/contexts/MarketContext";
import useGetMarketDetail from "@/hooks/useGetMarketDetail";
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

/**
 * TODO:
 * 1. 暫時使用之編輯畫面，UI 團隊可以重新調整，目前感覺應該是 Dialog 更為適合
 */

const dateFormat = "YYYY-MM-DD";

export default function EditMarket() {
    const router = useRouter();
    const { id } = router.query;
    const { setIsPageLoading } = useContext(LoadingContext);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [resolverUrl, setResolverUrl] = useState();
    const [timestamp, setTimestamp] = useState();
    const [date, setDate] = useState();
    const [isTest, setIsTest] = useState();
    const { provider, smartAccount, predictionWorldContract, predictionWorldInterface } = useContext(BiconomyAccountContext);
    const { marketDetail } = useContext(MarketContext);
    const { updateMarketDetail } = useGetMarketDetail();

    useEffect(() => {
        console.log('ENTER EFFECT...')
        if (id && predictionWorldContract && smartAccount && smartAccount.isAdminUser) {
            updateMarketDetail(id, predictionWorldContract);
        }
    }, [router.isReady, smartAccount]);


    useEffect(() => {
        if (id && predictionWorldContract && smartAccount && smartAccount.isAdminUser) {
            setTitle(marketDetail.title);
            setDescription(marketDetail.description);
            setImageUrl(marketDetail.imageHash);
            setResolverUrl(marketDetail.resolverUrl);
            setIsTest(marketDetail.isTest);
            if (marketDetail.endDate) {
                setDate(marketDetail.endDate.format(dateFormat));
                setTimestamp(marketDetail.endDate.valueOf());
            }
        }
    }, [marketDetail]);

    const handleSaveTitle = async (e) => {
        await updateMarketInfoWithGasless("setMarketInfoQuestion", title);
    }

    const handleSaveDescription = async (e) => {
        await updateMarketInfoWithGasless("setMarketInfoDescription", description);
    }

    const handleSaveImageUrl = async (e) => {
        await updateMarketInfoWithGasless("setMarketInfoImage", imageUrl);
    }

    const handleSaveResolverUrl = async (e) => {
        await updateMarketInfoWithGasless("setMarketInfoResolverUrl", resolverUrl);
    }

    const handleSaveEndTimestamp = async (e) => {
        await updateMarketInfoWithGasless("setMarketInfoEndTimestamp", timestamp);
    }

    const handleSaveIsTest = async (e) => {
        await updateMarketInfoWithGasless("setMarketInfoIsTest", isTest);
    }

    const updateMarketInfoWithGasless = async (functionName, value) => {
        setIsPageLoading(true);

        try {
            const transactionData = predictionWorldInterface.encodeFunctionData(functionName, [id, value]);

            const transaction = {
                to: predictionWorldAddress,
                data: transactionData
            };

            const txResponse = await smartAccount.sendTransaction({ transaction });
            console.log(`[UserOp hash] [${functionName}]`, txResponse.hash);
            const txReceipt = await txResponse.wait();
            console.log(`[Tx hash] [${functionName}]`, txReceipt.transactionHash);
            await provider.getTransactionReceipt(txReceipt.transactionHash);

            await updateMarketDetail(id, predictionWorldContract);
        } finally {
            setIsPageLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}
        >
            <AdminHeader />
            <Container maxWidth="md" component="main">
                <Link href="/?menu=Market">
                    <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                        Home
                    </Button>
                </Link>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        mt: 1,
                        borderColor: "divider",
                        borderWidth: 1,
                        borderRadius: 1,
                        p: 2
                    }}
                >
                    <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                        Add New Market
                    </Typography>
                    <Typography variant="subtitle1" component="div" sx={{ mt: 2, mb: 1 }}>
                        Market Title
                    </Typography>
                    <TextField
                        type="input"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        placeholder="Title"
                        autoComplete="off"
                        InputProps={{
                            endAdornment:
                                title &&
                                title !== marketDetail.title &&
                                <SaveIcon color="primary" className="cursor-pointer" onClick={handleSaveTitle} />
                        }}
                    />
                    <Typography variant="subtitle1" component="div" sx={{ mt: 2, mb: 1 }}>
                        Market Description
                    </Typography>
                    <TextField
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        placeholder="Description"
                        autoComplete="off"
                        multiline
                        InputProps={{
                            endAdornment:
                                description &&
                                description !== marketDetail.description &&
                                <SaveIcon color="primary" className="cursor-pointer" onClick={handleSaveDescription} />
                        }}
                    />
                    <Typography variant="subtitle1" component="div" sx={{ mt: 2, mb: 1 }}>
                        Market Image URL
                    </Typography>
                    <TextField
                        type="input"
                        name="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        fullWidth
                        placeholder="URL"
                        autoComplete="off"
                        InputProps={{
                            endAdornment:
                                imageUrl &&
                                imageUrl !== marketDetail.imageHash &&
                                <SaveIcon color="primary" className="cursor-pointer" onClick={handleSaveImageUrl} />
                        }}
                    />
                    <Typography variant="subtitle1" component="div" sx={{ mt: 2, mb: 1 }}>
                        Resolve URL
                    </Typography>
                    <TextField
                        type="input"
                        name="resolverUrl"
                        value={resolverUrl}
                        onChange={(e) => setResolverUrl(e.target.value)}
                        fullWidth
                        placeholder="URL"
                        autoComplete="off"
                        InputProps={{
                            endAdornment:
                                resolverUrl &&
                                resolverUrl !== marketDetail.resolverUrl &&
                                <SaveIcon color="primary" className="cursor-pointer" onClick={handleSaveResolverUrl} />
                        }}
                    />
                    <Typography variant="subtitle1" component="div" sx={{ mt: 2, mb: 1 }}>
                        End Date
                    </Typography>
                    <TextField
                        type="date"
                        name="timestamp"
                        value={date}
                        onChange={(e) => {
                            setTimestamp(e.target.valueAsDate?.getTime());
                            setDate(moment(e.target.valueAsDate).format(dateFormat));
                        }}
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        InputProps={{
                            endAdornment:
                                timestamp &&
                                timestamp !== marketDetail.endDate.valueOf() &&
                                <SaveIcon color="primary" className="cursor-pointer" onClick={handleSaveEndTimestamp} />
                        }}
                    />
                    <div sx={{ mt: 2, mb: 1 }}>
                        <FormControlLabel
                            label="Is this for testing?"
                            sx={{ mt: 2, mb: 1 }}
                            control={<Checkbox checked={isTest} onChange={(e) => setIsTest(!isTest)} />}
                        />
                        {
                            isTest !== marketDetail.isTest &&
                            <SaveIcon color="primary" className="cursor-pointer" onClick={handleSaveIsTest} />
                        }
                    </div>
                </Box>
            </Container>
        </Box >
    );
}
