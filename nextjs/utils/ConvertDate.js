import { ethers } from "ethers";
export const convertBigNumberToDate = (time) => {
    if (!time) return "";
    // 转换 BigNumber 对象到 JavaScript 数字字符串
    const timestampStr = ethers.BigNumber.from(time._hex).toString();
    // 将数字字符串转换为数字并且乘以 1000 来获取毫秒数
    let timestampMs = Number(timestampStr);
    if (timestampStr.length <= 10) timestampMs *= 1000; // 如果是秒，转换为毫秒
    // 用新的 Date 对象来表示该时间戳记
    const date = new Date(timestampMs);
    // 取出年份、月份、日期、小时、分钟和秒
    const year = date.getFullYear(); // 四位数的年份
    const month = date.getMonth() + 1; // 从 0 开始，所以我们需要加 1
    const day = date.getDate(); // 日期
    const hours = date.getHours(); // 小时
    const minutes = date.getMinutes(); // 分钟
    const seconds = date.getSeconds(); // 秒

    const outputDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return outputDate;
};

export const currentDate = () => {
    const currentDate = new Date();
    const timeStamp = currentDate.toISOString();
    return timeStamp;
};
