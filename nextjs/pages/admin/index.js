import { AdminHeader } from "@/components/Header/AdminHeader";
import { predictionWorldAddress } from "@/config";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { ethers } from "ethers";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";

export default function Admin() {
    const [submitButtonText, setSubmitButtonText] = useState("Create Market");
    const [balance, setBalance] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [resolverUrl, setResolverUrl] = useState("");
    const [timestamp, setTimestamp] = useState(Date());
    const { provider, sureTokenContract, account, smartAccount, predictionWorldInterface } = useContext(BiconomyAccountContext);

    const getBalance = useCallback(async () => {
        try {
            if (!account) {
                return;
            }
            let balance = await sureTokenContract.balanceOf(account);
            setBalance(ethers.utils.commify(balance));
        } catch (error) {
            console.error(`Error getting balance, ${error}`);
        }
    }, [account]);

    const handleSubmit = async () => {
        try {
            setSubmitButtonText("Creating");
            await createMarketWithGasless();
            alert("Success!");
        } catch (error) {
            console.error(`Error creating market`);
            console.error(error);
            alert("Error!!");
        } finally {
            setSubmitButtonText("Create Market");
        }
    };

    const createMarketWithGasless = async () => {
        let transactions = [];
        const transactionData = predictionWorldInterface.encodeFunctionData("createMarket", [title, "", description, resolverUrl, timestamp]);

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
        const txReceipt2 = await provider.getTransactionReceipt(txReceipt.transactionHash);
    };

    useEffect(() => {
        getBalance();
    }, [account, getBalance]);

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
                <Link href="/admin/markets">
                    <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                        See All Markets
                    </Button>
                </Link>
                You have: {balance} SURE tokens
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
                    />
                    <Typography variant="subtitle1" component="div" sx={{ mt: 2, mb: 1 }}>
                        Market Image URL
                    </Typography>
                    <TextField
                        type="input"
                        name="resolverUrl"
                        value={resolverUrl}
                        onChange={(e) => setResolverUrl(e.target.value)}
                        fullWidth
                        placeholder="URL"
                        autoComplete="off"
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
                    />
                    <Typography variant="subtitle1" component="div" sx={{ mt: 2, mb: 1 }}>
                        End Date
                    </Typography>
                    <TextField
                        type="date"
                        name="timestamp"
                        // value={timestamp}
                        onChange={(e) => {
                            setTimestamp(e.target.valueAsDate?.getTime());
                        }}
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        style={{ backgroundColor: "#2e7d32" }}
                        sx={{ mt: 2 }}
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        {submitButtonText}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
