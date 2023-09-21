import baseAxios from "@/service/baseAxios";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { convertToDatetimeLocalFormat, formatDateToInput } from "@/utils/ConvertDate";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MarketEditForm({ marketId = null, apiPath, editPropsData }) {
    const router = useRouter();
    const { setIsPageLoading } = useLoadingStore();
    const { token } = useAccountStore();
    const [submitButtonText, setSubmitButtonText] = useState("Create Market");
    const [title, setTitle] = useState(editPropsData?.title || "");
    const [description, setDescription] = useState(editPropsData?.description || "");
    const [imageUrl, setImageUrl] = useState(editPropsData?.imageUrl || "");
    const [resolverUrl, setResolverUrl] = useState(editPropsData?.resolverUrl || "");
    const [timestamp, setTimestamp] = useState(formatDateToInput(new Date()));
    const [isTest, setIsTest] = useState(editPropsData?.isTest || false);

    useEffect(() => {
        if (editPropsData) {
            setTitle(editPropsData?.title || "");
            setDescription(editPropsData?.description || "");
            setImageUrl(editPropsData?.imageUrl || "");
            setResolverUrl(editPropsData?.resolverUrl || "");
            setIsTest(editPropsData?.isTest || false);

            // 如果 editPropsData 有 timestamp，你也可以這樣設定：
            if (editPropsData?.timestamp) {
                const formattedTimestamp = convertToDatetimeLocalFormat(editPropsData.timestamp); // 使用你之前的轉換函數
                setTimestamp(formattedTimestamp);
            }
        }
    }, [editPropsData]);

    const handleSubmit = async () => {
        try {
            setIsPageLoading(true);
            setSubmitButtonText("Creating");
            const toEndTimestamp = new Date(timestamp);
            const utcString = toEndTimestamp.toISOString();
            let data = {
                Payload: {
                    Title: title,
                    Description: description,
                    ImageUrl: imageUrl,
                    ResolveUrl: resolverUrl,
                    EndTime: utcString,
                    IsTest: isTest
                }
            };
            if (marketId) {
                data = {
                    ...data,
                    Payload: {
                        ...data.Payload,
                        MarketId: parseInt(marketId, 10)
                    }
                };
            }
            const response = await baseAxios({
                method: "POST",
                url: apiPath,
                token: token,
                data: data
            });
            if (response && response.ErrorCode === 0) {
                setTitle("");
                setDescription("");
                setImageUrl("");
                setResolverUrl("");
                setTimestamp("");
                setIsTest(false);
            } else {
                throw new Error("Error creating market");
            }
            alert("Success!");
        } catch (error) {
            console.error(`Error creating market`);
            console.error(error);
        } finally {
            setIsPageLoading(false);
            setSubmitButtonText("Create Market");
            router.push("/admin/markets");
        }
    };

    return (
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
            <TextField type="input" name="title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth placeholder="Title" autoComplete="off" />
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
                name="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
                type="datetime-local"
                name="timestamp"
                onChange={(e) => {
                    setTimestamp(Date.parse(e.target.value));
                }}
                fullWidth
                InputLabelProps={{
                    shrink: true
                }}
                // defaultValue={timestamp}
                value={formatDateToInput(new Date(timestamp))}
            />
            <FormControlLabel label="Is this for testing?" sx={{ mt: 2, mb: 1 }} control={<Checkbox checked={isTest} onChange={(e) => setIsTest(!isTest)} />} />
            <Button variant="contained" color="success" fullWidth style={{ backgroundColor: "#2e7d32" }} sx={{ mt: 2 }} onClick={handleSubmit}>
                {submitButtonText}
            </Button>
        </Box>
    );
}
