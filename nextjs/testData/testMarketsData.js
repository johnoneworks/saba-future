const { BigNumber } = require("ethers");
export const testMarketsData = [
    {
        id: 1,
        question: "會不會寫到第 50 版~? XD",
        imageHash: "https://mumbai.polygonscan.com/images/logo.svg?v=0.0.4",
        isTest: true,
        totalAmount: 185,
        totalYesAmount: 100,
        totalNoAmount: 85,
        marketClosed: false,
        outcome: false,
        yesBets: [
            {
                time: "2023-05-04T16:56:18.000Z",
                amount: 1,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T05:25:57.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-05-15T10:15:47.000Z",
                amount: 20,
                user: "0x99e9624508534FC190B233CB1D3a9b755B5D312d"
            },
            {
                time: "2023-05-18T05:11:53.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-18T08:09:51.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-22T09:08:33.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            }
        ],
        noBets: [
            {
                time: "2023-05-13T15:12:23.000Z",
                amount: 10,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T10:11:07.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-06-16T06:00:06.000Z",
                amount: 1,
                user: "0xa5c1D6514807D4655a9635cE2A40d83228Ae9E8B"
            }
        ],
        info: {
            question: "會不會寫到第 50 版~? XD",
            timestamp: BigNumber.from("0x64819c03"),
            endTimestamp: BigNumber.from("0x018909997800")
        }
    },
    {
        id: 2,
        question: "Edward 會不會買 PS5",
        imageHash: "https://mumbai.polygonscan.com/images/logo.svg?v=0.0.4",
        isTest: false,
        totalAmount: 1850,
        totalYesAmount: 1000,
        totalNoAmount: 850,
        marketClosed: false,
        outcome: false,
        info: {
            question: "Edward 會不會買 PS5",
            timestamp: BigNumber.from("0x64819c03"),
            endTimestamp: BigNumber.from("0x018909997800")
        },
        yesBets: [
            {
                time: "2023-05-04T16:56:18.000Z",
                amount: 1,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T05:25:57.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-05-15T10:15:47.000Z",
                amount: 20,
                user: "0x99e9624508534FC190B233CB1D3a9b755B5D312d"
            },
            {
                time: "2023-05-18T05:11:53.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-18T08:09:51.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-22T09:08:33.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            }
        ],
        noBets: [
            {
                time: "2023-05-13T15:12:23.000Z",
                amount: 10,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T10:11:07.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-06-16T06:00:06.000Z",
                amount: 1,
                user: "0xa5c1D6514807D4655a9635cE2A40d83228Ae9E8B"
            }
        ]
    },
    {
        id: 3,
        question: "上線會不會順利",
        imageHash: "https://mumbai.polygonscan.com/images/logo.svg?v=0.0.4",
        totalAmount: 2000,
        isTest: true,
        totalYesAmount: 2000,
        totalNoAmount: 0,
        marketClosed: false,
        outcome: false,
        info: {
            question: "上線會不會順利",
            timestamp: BigNumber.from("0x64819c03"),
            endTimestamp: BigNumber.from("0x018909997800")
        },
        yesBets: [
            {
                time: "2023-05-04T16:56:18.000Z",
                amount: 1,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T05:25:57.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-05-15T10:15:47.000Z",
                amount: 20,
                user: "0x99e9624508534FC190B233CB1D3a9b755B5D312d"
            },
            {
                time: "2023-05-18T05:11:53.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-18T08:09:51.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-22T09:08:33.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            }
        ],
        noBets: [
            {
                time: "2023-05-13T15:12:23.000Z",
                amount: 10,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T10:11:07.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-06-16T06:00:06.000Z",
                amount: 1,
                user: "0xa5c1D6514807D4655a9635cE2A40d83228Ae9E8B"
            }
        ]
    },
    {
        id: 4,
        question: "會不會寫到第 500 版~? XD",
        imageHash: "https://mumbai.polygonscan.com/images/logo.svg?v=0.0.4",
        totalAmount: 185,
        isTest: false,
        totalYesAmount: 100,
        totalNoAmount: 85,
        marketClosed: true,
        outcome: false,
        info: {
            question: "會不會寫到第 500 版~? XD",
            timestamp: BigNumber.from("0x64819c03"),
            endTimestamp: BigNumber.from("0x018909997800")
        },
        yesBets: [
            {
                time: "2023-05-04T16:56:18.000Z",
                amount: 1,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T05:25:57.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-05-15T10:15:47.000Z",
                amount: 20,
                user: "0x99e9624508534FC190B233CB1D3a9b755B5D312d"
            },
            {
                time: "2023-05-18T05:11:53.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-18T08:09:51.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-22T09:08:33.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            }
        ],
        noBets: [
            {
                time: "2023-05-13T15:12:23.000Z",
                amount: 10,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T10:11:07.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-06-16T06:00:06.000Z",
                amount: 1,
                user: "0xa5c1D6514807D4655a9635cE2A40d83228Ae9E8B"
            }
        ]
    },
    {
        id: 5,
        question: "今天會順利完工嗎?",
        imageHash: "https://mumbai.polygonscan.com/images/logo.svg?v=0.0.4",
        isTest: true,
        totalAmount: 185,
        totalYesAmount: 100,
        totalNoAmount: 85,
        marketClosed: true,
        outcome: false,
        info: {
            question: "今天會順利完工嗎?",
            timestamp: BigNumber.from("0x64819c03"),
            endTimestamp: BigNumber.from("0x018909997800")
        },
        yesBets: [
            {
                time: "2023-05-04T16:56:18.000Z",
                amount: 1,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T05:25:57.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-05-15T10:15:47.000Z",
                amount: 20,
                user: "0x99e9624508534FC190B233CB1D3a9b755B5D312d"
            },
            {
                time: "2023-05-18T05:11:53.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-18T08:09:51.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            },
            {
                time: "2023-05-22T09:08:33.000Z",
                amount: 10,
                user: "0x46cAa7f3581b723542F971E42e98eFFce92Fbb0f"
            }
        ],
        noBets: [
            {
                time: "2023-05-13T15:12:23.000Z",
                amount: 10,
                user: "0xcc6Ccc0A7B31aAa8D22dB488af14c762f643C142"
            },
            {
                time: "2023-05-15T10:11:07.000Z",
                amount: 20,
                user: "0x3bfdF131eC66Abf6A5fA7265851d735163b0430E"
            },
            {
                time: "2023-06-16T06:00:06.000Z",
                amount: 1,
                user: "0xa5c1D6514807D4655a9635cE2A40d83228Ae9E8B"
            }
        ]
    }
];
