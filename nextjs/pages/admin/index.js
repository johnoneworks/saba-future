import { Header } from "@/components/Header/Header";
import { API_CREATE_MARKET } from "@/constants/api";
import baseAxios from "@/service/baseAxios";
import { useLoadingStore } from "@/store/useLoadingStore";
import { Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

/**
 * TODO:
 * 1. 畫面優化
 * 2. is production 的條件
 */

// 取出要用的資料
// 送 api
export default function Admin() {
    const { isPageLoading, setIsPageLoading } = useLoadingStore();
    const [submitButtonText, setSubmitButtonText] = useState("Create Market");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [resolverUrl, setResolverUrl] = useState("");
    const [timestamp, setTimestamp] = useState(new Date());
    const [isTest, setIsTest] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsPageLoading(true);
            setSubmitButtonText("Creating");
            const toEndTimestamp = new Date(timestamp);
            const utcString = toEndTimestamp.toISOString();
            const data = {
                Payload: {
                    Title: title,
                    Description: description,
                    ImageUrl: imageUrl,
                    ResolveUrl: resolverUrl,
                    EndTime: utcString,
                    IsTest: isTest
                }
            };
            const response = await baseAxios({
                method: "POST",
                url: API_CREATE_MARKET,
                data: data
            });
            setTitle("");
            setDescription("");
            setImageUrl("");
            setResolverUrl("");
            setTimestamp("");
            setIsTest(false);
            alert("Success!");
        } catch (error) {
            console.error(`Error creating market`);
            console.error(error);
        } finally {
            setIsPageLoading(false);
            setSubmitButtonText("Create Market");
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
            <Header />
            {!isPageLoading && (
                <Container maxWidth="md" component="main">
                    <Link href="/admin/markets">
                        <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                            See All Markets
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
                        />
                        <FormControlLabel
                            label="Is this for testing?"
                            sx={{ mt: 2, mb: 1 }}
                            control={<Checkbox checked={isTest} onChange={(e) => setIsTest(!isTest)} />}
                        />
                        <Button variant="contained" color="success" fullWidth style={{ backgroundColor: "#2e7d32" }} sx={{ mt: 2 }} onClick={handleSubmit}>
                            {submitButtonText}
                        </Button>
                    </Box>
                </Container>
            )}
        </Box>
    );
}
