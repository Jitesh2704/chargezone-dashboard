import React, { useState } from 'react';
import { Table, DatePicker, Button, Tabs, ConfigProvider, Pagination, Select, Image } from 'antd';
import { Download, BarChart2, FileText, Activity } from 'lucide-react';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CustomDropdown from '../components/Dropdowns/CustomDropdown';
import DraggableHeaderCell from '../components/Tables/DraggableHeaderCell';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const { RangePicker } = DatePicker;

function getTodayISTRange() {
    const start = dayjs().tz("Asia/Kolkata").startOf("day");
    const end = dayjs().tz("Asia/Kolkata").endOf("day");
    return {
        startDate: start.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: end.format("YYYY-MM-DDTHH:mm:ss"),
    };
}

// Dummy data for Summary Report
const incidentTypes = ["Fire & Smoke", "Unauthorized Presence", "SOP Violation", "Camera Offline", "Overstay", "Fence Breach"];
const generateSummaryData = () => {
    return Array.from({ length: 45 }).map((_, i) => {
        const isResolved = i % 2 !== 0;
        const timestamp = dayjs().subtract(i * 45, 'minute');
        return {
            key: i,
            sNo: i + 1,
            type: incidentTypes[i % incidentTypes.length],
            bayName: `Bay 0${(i % 3) + 1}`,
            camera: `Cam-${(i % 5) + 1}`,
            vehicleNo: i % 3 === 0 ? `MH12 AB ${1000 + i}` : 'N/A',
            status: isResolved ? 'Resolved' : 'Active',
            timestamp: timestamp.format('Do MMM YYYY, hh:mm A'),
            rawTimestamp: timestamp,
            endedTimestamp: isResolved ? timestamp.add(30, 'minute').format('Do MMM YYYY, hh:mm A') : '-',
            elapsedTime: isResolved ? '-' : `${30 + i} mins`,
            imageUrl: `https://picsum.photos/seed/summary${i}/800/600`,
        }
    });
};

// Dummy data for Downtime Report
const generateDowntimeData = () => {
    return Array.from({ length: 15 }).map((_, i) => {
        const fromTime = dayjs().subtract(i * 2 + 1, 'hour');
        const toTime = fromTime.add(45 + (i * 10), 'minute');
        const downtimeMinutes = toTime.diff(fromTime, 'minute');
        return {
            key: i,
            sNo: i + 1,
            camera: `Cam-${(i % 5) + 1}`,
            status: i % 3 === 0 ? 'Active' : 'Resolved',
            fromTimestamp: fromTime.format('Do MMM YYYY, hh:mm A'),
            toTimestamp: i % 3 === 0 ? '-' : toTime.format('Do MMM YYYY, hh:mm A'),
            downtime: i % 3 === 0 ? `${dayjs().diff(fromTime, 'minute')} mins (Ongoing)` : `${downtimeMinutes} mins`,
        }
    });
};

// Dummy data for Incident Tracker (Latest 30)
const generateTrackerData = () => {
    return Array.from({ length: 30 }).map((_, i) => ({
        key: i,
        sNo: i + 1,
        camera: `Cam-${(i % 4) + 1}`,
        incident: incidentTypes[i % incidentTypes.length],
        timestamp: dayjs().subtract(i * 5, 'minute').format('Do MMM YYYY, hh:mm A'),
        status: i < 5 ? 'Active' : 'Resolved',
    }));
};

const summaryData = generateSummaryData();
const downtimeData = generateDowntimeData();
const trackerData = generateTrackerData();

function Analytics() {
    const [activeTab, setActiveTab] = useState('summary');
    
    // Summary Report State
    const { startDate: defaultStart, endDate: defaultEnd } = getTodayISTRange();
    const [summaryStartDate, setSummaryStartDate] = useState(defaultStart);
    const [summaryEndDate, setSummaryEndDate] = useState(defaultEnd);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [summaryPage, setSummaryPage] = useState(1);
    const [summaryPageSize, setSummaryPageSize] = useState(10);
    const [summaryColWidths, setSummaryColWidths] = useState({});

    // Downtime Report State
    const [downtimeStartDate, setDowntimeStartDate] = useState(defaultStart);
    const [downtimeEndDate, setDowntimeEndDate] = useState(defaultEnd);
    const [downtimePage, setDowntimePage] = useState(1);
    const [downtimePageSize, setDowntimePageSize] = useState(10);
    const [downtimeColWidths, setDowntimeColWidths] = useState({});

    // Tracker State
    const [trackerStartDate, setTrackerStartDate] = useState(defaultStart);
    const [trackerEndDate, setTrackerEndDate] = useState(defaultEnd);
    const [trackerColWidths, setTrackerColWidths] = useState({});
    const [trackerPage, setTrackerPage] = useState(1);
    const [trackerPageSize, setTrackerPageSize] = useState(10);

    const formatToFakeUTC = (date) => {
        if (!date) return null;
        return date.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
    };

    // Filters for Summary
    const filteredSummaryData = summaryData.filter(item => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) {
            return false;
        }
        return true;
    });
    const paginatedSummary = filteredSummaryData.slice((summaryPage - 1) * summaryPageSize, summaryPage * summaryPageSize);
    const paginatedDowntime = downtimeData.slice((downtimePage - 1) * downtimePageSize, downtimePage * downtimePageSize);
    const paginatedTracker = trackerData.slice((trackerPage - 1) * trackerPageSize, trackerPage * trackerPageSize);

    const handleResize = (setColWidths, key, deltaX) => {
        setColWidths((prev) => {
            const oldWidth = prev[key] || 150;
            return { ...prev, [key]: Math.max(50, oldWidth + deltaX) };
        });
    };

    const applyDraggable = (columns, colWidths, setColWidths) => {
        return columns.map(col => ({
            ...col,
            width: colWidths[col.key] || col.width,
            onHeaderCell: (column) => ({
                width: column.width,
                onResize: (deltaX) => handleResize(setColWidths, column.key, deltaX),
            }),
        }));
    };

    // Columns: Summary
    const summaryColumns = applyDraggable([
        { title: 'S.No', dataIndex: 'sNo', key: 'sNo', width: 70 },
        { 
            title: 'Incident Type', 
            dataIndex: 'type', 
            key: 'type', 
            width: 180,
            render: (text) => <span className="font-semibold text-[#1e2d5b]">{text}</span>
        },
        { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', width: 100 },
        { title: 'Camera Name', dataIndex: 'camera', key: 'camera', width: 130 },
        { title: 'Current Vehicle', dataIndex: 'vehicleNo', key: 'vehicleNo', width: 150 },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            width: 100,
            render: (text) => (
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${text === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {text}
                </span>
            )
        },
        { title: 'Triggered Timestamp', dataIndex: 'timestamp', key: 'timestamp', width: 180 },
        { 
            title: 'Ended / Elapsed Time', 
            key: 'endedElapsed', 
            width: 180,
            render: (_, record) => record.status === 'Resolved' ? record.endedTimestamp : `${record.elapsedTime} (Elapsed)`
        },
        {
            title: 'Incident Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 120,
            render: (url) => (
                <Image
                    width={40}
                    height={40}
                    src={url}
                    className="rounded-md object-cover cursor-pointer"
                    preview={{ maskClassName: "rounded-md", src: url }}
                />
            )
        }
    ], summaryColWidths, setSummaryColWidths);

    // Columns: Downtime
    const downtimeColumns = applyDraggable([
        { title: 'S.No', dataIndex: 'sNo', key: 'sNo', width: 70 },
        { title: 'Camera', dataIndex: 'camera', key: 'camera', width: 120 },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            width: 120,
            render: (text) => (
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${text === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {text}
                </span>
            )
        },
        { title: 'From Timestamp', dataIndex: 'fromTimestamp', key: 'fromTimestamp', width: 220 },
        { title: 'To Timestamp', dataIndex: 'toTimestamp', key: 'toTimestamp', width: 220 },
        { 
            title: 'Downtime', 
            dataIndex: 'downtime', 
            key: 'downtime', 
            width: 150,
            render: (text) => <span className="font-semibold text-gray-700">{text}</span>
        },
    ], downtimeColWidths, setDowntimeColWidths);

    // Columns: Tracker
    const trackerColumns = applyDraggable([
        { title: 'S.No', dataIndex: 'sNo', key: 'sNo', width: 70 },
        { title: 'Camera', dataIndex: 'camera', key: 'camera', width: 100 },
        { title: 'Incident', dataIndex: 'incident', key: 'incident', width: 200 },
        { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', width: 200 },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            width: 100,
            render: (text) => (
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${text === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {text}
                </span>
            )
        },
    ], trackerColWidths, setTrackerColWidths);


    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1e2d5b',
                },
            }}
        >
            <style>
                {`
                .custom-pagination .ant-pagination-item-active {
                    background-color: #2D3394 !important;
                    border-color: #2D3394 !important;
                }
                .custom-pagination .ant-pagination-item-active a {
                    color: white !important;
                }
                .custom-pagination .ant-pagination-prev .ant-pagination-item-link,
                .custom-pagination .ant-pagination-next .ant-pagination-item-link {
                    color: gray !important;
                    font-weight: bold !important;
                }
                .ant-spin-dot-item {
                    background-color: #2D3394 !important;
                }
                `}
            </style>

            <div className='w-full max-w-[1400px] mx-auto'>
                <div className="mb-6">
                    <div className="text-xl xl:text-3xl tracking-tight text-gray-800 font-semibold">
                        Analytics & Reports
                    </div>
                    <p className="text-sm text-gray-500 mt-1 tracking-tight">
                        Generate insights, track downtime, and monitor real-time incidents.
                    </p>
                </div>

                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab} 
                    className="modern-tabs mb-4"
                    items={[
                        {
                            key: 'summary',
                            label: (
                                <span className="flex items-center gap-2 px-2 text-[15px] font-semibold">
                                    <BarChart2 size={18} /> Summary Report
                                </span>
                            ),
                            children: (
                                <>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                                        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-gray-500 text-xs md:text-sm font-medium">Start Timings:</span>
                                                <DatePicker
                                                    showTime
                                                    value={summaryStartDate ? dayjs(summaryStartDate.slice(0, -1)) : null}
                                                    onChange={(d) => setSummaryStartDate(formatToFakeUTC(d))}
                                                    style={{ width: 220, height: 44 }}
                                                    className="border-gray-300"
                                                />
                                            </div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-gray-500 text-xs md:text-sm font-medium">End Timings:</span>
                                                <DatePicker
                                                    showTime
                                                    value={summaryEndDate ? dayjs(summaryEndDate.slice(0, -1)) : null}
                                                    onChange={(d) => setSummaryEndDate(formatToFakeUTC(d))}
                                                    style={{ width: 220, height: 44 }}
                                                    className="border-gray-300"
                                                />
                                            </div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-gray-500 text-xs md:text-sm font-medium">Filter by Incident Types:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="All Types"
                                                    value={selectedTypes}
                                                    onChange={setSelectedTypes}
                                                    style={{ width: 300, height: 44 }}
                                                    options={incidentTypes.map(t => ({ label: t, value: t }))}
                                                    maxTagCount="responsive"
                                                />
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 bg-[#1e2d5b] hover:scale-105 duration-200 transition-all cursor-pointer text-white h-11 px-5 font-semibold rounded-lg shadow-md w-full md:w-auto">
                                            <Download size={18} /> Export CSV
                                        </button>
                                    </div>
                                    <div className="w-full bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                        <Table 
                                            columns={summaryColumns} 
                                            dataSource={paginatedSummary} 
                                            className="custom-table"
                                            components={{ header: { cell: DraggableHeaderCell } }}
                                            pagination={false}
                                            scroll={{ x: 'max-content' }}
                                        />
                                        <div className="flex flex-col md:flex-row justify-start md:justify-between items-center mt-6 px-2 border-t border-gray-100 pt-4">
                                            <div className="text-sm text-[#898989] flex items-center gap-2">
                                                <span>Showing:</span>
                                                <CustomDropdown values={["5", "10", "25", "50"]} width={70} height={32} selectedValue={summaryPageSize.toString()} onValueChange={(e) => {setSummaryPage(1); setSummaryPageSize(parseInt(e));}} />
                                                <span>Items</span>
                                            </div>
                                            <Pagination current={summaryPage} pageSize={summaryPageSize} total={filteredSummaryData.length} onChange={(p) => setSummaryPage(p)} className="custom-pagination" />
                                        </div>
                                    </div>
                                </>
                            )
                        },
                        {
                            key: 'downtime',
                            label: (
                                <span className="flex items-center gap-2 px-2 text-[15px] font-semibold">
                                    <FileText size={18} /> Downtime Report
                                </span>
                            ),
                            children: (
                                <>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                                        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-gray-500 text-xs md:text-sm font-medium">Start Timings:</span>
                                                <DatePicker
                                                    showTime
                                                    value={downtimeStartDate ? dayjs(downtimeStartDate.slice(0, -1)) : null}
                                                    onChange={(d) => setDowntimeStartDate(formatToFakeUTC(d))}
                                                    style={{ width: 220, height: 44 }}
                                                    className="border-gray-300"
                                                />
                                            </div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-gray-500 text-xs md:text-sm font-medium">End Timings:</span>
                                                <DatePicker
                                                    showTime
                                                    value={downtimeEndDate ? dayjs(downtimeEndDate.slice(0, -1)) : null}
                                                    onChange={(d) => setDowntimeEndDate(formatToFakeUTC(d))}
                                                    style={{ width: 220, height: 44 }}
                                                    className="border-gray-300"
                                                />
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 bg-[#1e2d5b] hover:scale-105 duration-200 transition-all cursor-pointer text-white h-11 px-5 font-semibold rounded-lg shadow-md w-full md:w-auto">
                                            <Download size={18} /> Export CSV
                                        </button>
                                    </div>
                                    <div className="w-full bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                        <Table 
                                            columns={downtimeColumns} 
                                            dataSource={paginatedDowntime} 
                                            className="custom-table"
                                            components={{ header: { cell: DraggableHeaderCell } }}
                                            pagination={false}
                                            scroll={{ x: 'max-content' }}
                                        />
                                        <div className="flex flex-col md:flex-row justify-start md:justify-between items-center mt-6 px-2 border-t border-gray-100 pt-4">
                                            <div className="text-sm text-[#898989] flex items-center gap-2">
                                                <span>Showing:</span>
                                                <CustomDropdown values={["5", "10", "25"]} width={70} height={32} selectedValue={downtimePageSize.toString()} onValueChange={(e) => {setDowntimePage(1); setDowntimePageSize(parseInt(e));}} />
                                                <span>Items</span>
                                            </div>
                                            <Pagination current={downtimePage} pageSize={downtimePageSize} total={downtimeData.length} onChange={(p) => setDowntimePage(p)} className="custom-pagination" />
                                        </div>
                                    </div>
                                </>
                            )
                        },
                        {
                            key: 'tracker',
                            label: (
                                <span className="flex items-center gap-2 px-2 text-[15px] font-semibold">
                                    <Activity size={18} /> Incident Tracker
                                </span>
                            ),
                            children: (
                                <>
                                    <div className="font-semibold text-gray-500 mb-6 mt-2">Showing latest 30 incidents across all cameras.</div>
                                    <div className="w-full bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
                                        <Table 
                                            columns={trackerColumns} 
                                            dataSource={paginatedTracker} 
                                            className="custom-table"
                                            components={{ header: { cell: DraggableHeaderCell } }}
                                            pagination={false}
                                            scroll={{ x: 'max-content' }}
                                        />
                                        <div className="flex flex-col md:flex-row justify-start md:justify-between items-center mt-6 px-2 border-t border-gray-100 pt-4">
                                            <div className="text-sm text-[#898989] flex items-center gap-2">
                                                <span>Showing:</span>
                                                <CustomDropdown values={["5", "10", "25", "30", "50"]} width={70} height={32} selectedValue={trackerPageSize.toString()} onValueChange={(e) => {setTrackerPage(1); setTrackerPageSize(parseInt(e));}} />
                                                <span>Items</span>
                                            </div>
                                            <Pagination current={trackerPage} pageSize={trackerPageSize} total={trackerData.length} onChange={(p) => setTrackerPage(p)} className="custom-pagination" />
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    ]}
                />
            </div>
        </ConfigProvider>
    );
}

export default Analytics;
