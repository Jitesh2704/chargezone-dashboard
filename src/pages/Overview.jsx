import React, { useState } from 'react';
import { ConfigProvider, DatePicker } from "antd";
import BayStats from '../sections/Overview/BayStats';
import AlertStats from '../sections/Overview/AlertStats';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { CarFront } from "lucide-react";

function getTodayISTRange() {
    const start = dayjs().tz("Asia/Kolkata").startOf("day");
    const end = dayjs().tz("Asia/Kolkata").endOf("day");

    return {
        startDate: start.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: end.format("YYYY-MM-DDTHH:mm:ss"),
    };
}

function Overview() {
    const { startDate: defaultStart, endDate: defaultEnd } = getTodayISTRange();
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
    const totalTracked = 156;

    const formatToFakeUTC = (date) => {
        if (!date) return null;
        return date.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
    };

    const handleStartChange = (date) => {
        setStartDate(formatToFakeUTC(date));
    };

    const handleEndChange = (date) => {
        setEndDate(formatToFakeUTC(date));
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#2D3394",
                    colorPrimaryHover: "#656dcf",
                    colorPrimaryActive: "#2D3394",
                    colorLink: "#2D3394",
                    colorLinkHover: "#656dcf",
                    borderRadius: 8,
                },
            }}
        >
            <div className='w-full max-w-[1400px] mx-auto'>
                <div className="flex flex-col md:flex-row justify-between mb-6 items-start md:items-end gap-4 md:gap-0">
                    <div>
                        <div className="text-xl xl:text-3xl tracking-tight text-gray-800 font-semibold">
                            Station Overview Dashboard
                        </div>
                        <p className="text-sm text-gray-500 mt-1 tracking-tight">
                            Real-time analytics and monitoring for Charge Zone Station.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-end gap-3">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-gray-500 text-xs md:text-sm font-medium">
                                Select Start Timings:
                            </span>
                            <DatePicker
                                showTime
                                value={startDate ? dayjs(startDate.slice(0, -1)) : null}
                                onChange={handleStartChange}
                                placeholder="Select start date"
                                style={{ width: 220, height: 44 }}
                                className=" border-gray-300"
                            />
                        </div>

                        <div className="flex flex-col items-start gap-1">
                            <span className="text-gray-500 text-xs md:text-sm font-medium">
                                Select End Timings:
                            </span>
                            <DatePicker
                                showTime
                                value={endDate ? dayjs(endDate.slice(0, -1)) : null}
                                onChange={handleEndChange}
                                placeholder="Select end date"
                                style={{ width: 220, height: 44 }}
                                className=" border-gray-300"
                            />
                        </div>

                        <div className="bg-white border-2 border-gray-200 px-2 rounded-lg flex flex-row justify-center items-center gap-2 h-11">
                            <div className="text-xs font-semibold uppercase text-gray-500">Total Tracked:</div>
                            <div className="text-xl font-bold text-[#1e2d5b] leading-tight">{totalTracked}</div>
                        </div>
                    </div>
                </div>
                <BayStats />
                <AlertStats />
            </div>
        </ConfigProvider>
    );
}

export default Overview;