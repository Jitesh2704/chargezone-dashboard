import React, { useState } from 'react';
import { Table, DatePicker, Button, Image, Tabs, ConfigProvider, Pagination } from 'antd';
import { Download } from 'lucide-react';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CustomDropdown from '../Dropdowns/CustomDropdown';
import DraggableHeaderCell from './DraggableHeaderCell';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

function getTodayISTRange() {
    const start = dayjs().tz("Asia/Kolkata").startOf("day");
    const end = dayjs().tz("Asia/Kolkata").endOf("day");

    return {
        startDate: start.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: end.format("YYYY-MM-DDTHH:mm:ss"),
    };
}

// Dummy data generator function
const generateDummyData = (tabTitle, isResolvable) => {
    return Array.from({ length: 25 }).map((_, i) => {
        const timestamp = dayjs().subtract(i * 15, 'minute');
        const isResolved = i % 2 !== 0;

        return {
            key: i,
            sNo: i + 1,
            camera: `Cam-${(i % 4) + 1}`,
            bayName: `Bay 0${(i % 3) + 1}`,
            title: tabTitle,
            description: `${tabTitle} detected in zone ${(i % 3) + 1}`,
            timestamp: timestamp.format('Do MMM YYYY, hh:mm A'),
            vehicleNo: i % 2 === 0 ? `KA0${i % 9}AB123${i}` : 'N/A',
            imageUrl: `https://picsum.photos/seed/${i + tabTitle.replace(/ /g, '')}/800/600`,
            status: isResolved ? 'Resolved' : 'Active',
            resolvedAt: isResolved ? timestamp.add(30, 'minute').format('Do MMM YYYY, hh:mm A') : null,
            rawTimestamp: timestamp, // Keeping raw timestamp for sorting/elapsed calculations if needed
            entryTime: timestamp.format('Do MMM YYYY, hh:mm A'),
            exitTime: isResolved ? timestamp.add(30, 'minute').format('Do MMM YYYY, hh:mm A') : '-',
            standardTime: '45 mins',
            bayTime: `${Math.floor(Math.random() * 60) + 10} mins`,
            overstayDuration: isResolved ? '-' : `${Math.floor(Math.random() * 30) + 5} mins`,
        }
    });
};

const CommonAlertTable = ({ tabs, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].key : ''));

    // Dates
    const { startDate: defaultStart, endDate: defaultEnd } = getTodayISTRange();
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Column widths for resizable
    const [columnWidths, setColumnWidths] = useState({});

    // Data corresponding to the active tab
    const currentTab = tabs.find(t => t.key === activeTab);
    const isResolvable = currentTab?.isResolvable ?? false;
    const data = currentTab ? generateDummyData(currentTab.title, isResolvable) : [];

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

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        if (size) setPageSize(size);
    };

    const handleResize = (key, deltaX) => {
        setColumnWidths((prev) => {
            const oldWidth = prev[key] || 150;
            return { ...prev, [key]: Math.max(50, oldWidth + deltaX) };
        });
    };

    const handleExportCSV = () => {
        if (data.length === 0) return;

        let headers = [];
        const rows = data.map(row => {
            const elapsed = row.rawTimestamp ? Math.round((dayjs().valueOf() - row.rawTimestamp.valueOf()) / 60000) + ' min' : '-';
            let rowData = [];
            
            switch (activeTab) {
                case 'cam-deviation':
                    headers = ['S.No', 'Camera Name', 'Bay Name', 'Title', 'Description', 'Status', 'Timestamp', 'Elapsed Time', 'Resolved At'];
                    rowData = [row.sNo, row.camera, row.bayName, `"${row.title}"`, `"${row.description}"`, row.status, `"${row.timestamp}"`, elapsed, `"${row.resolvedAt || '-'}"`];
                    break;
                case 'unauth-presence':
                    headers = ['S.No', 'Camera Name', 'Bay Name', 'Current Vehicle.No', 'Title', 'Description', 'Timestamp'];
                    rowData = [row.sNo, row.camera, row.bayName, row.vehicleNo, `"${row.title}"`, `"${row.description}"`, `"${row.timestamp}"`];
                    break;
                case 'fence-breach':
                    headers = ['S.No', 'Camera Name', 'Bay Name', 'Title', 'Description', 'Timestamp'];
                    rowData = [row.sNo, row.camera, row.bayName, `"${row.title}"`, `"${row.description}"`, `"${row.timestamp}"`];
                    break;
                case 'cam-tampering':
                    headers = ['S.No', 'Camera Name', 'Title', 'Description', 'Timestamp'];
                    rowData = [row.sNo, row.camera, `"${row.title}"`, `"${row.description}"`, `"${row.timestamp}"`];
                    break;
                case 'cam-off':
                    headers = ['S.No', 'Camera Name', 'Title', 'Description', 'Status', 'Timestamp', 'Elapsed Time', 'Resolved At'];
                    rowData = [row.sNo, row.camera, `"${row.title}"`, `"${row.description}"`, row.status, `"${row.timestamp}"`, elapsed, `"${row.resolvedAt || '-'}"`];
                    break;
                case 'ev-id':
                    headers = ['S.No', 'Title', 'Description', 'Vehicle Number', 'Bay Name', 'Camera Name', 'Entry Time', 'Exit Time', 'Time Elapsed / Bay Time', 'Standard Time'];
                    rowData = [row.sNo, `"${row.title}"`, `"${row.description}"`, row.vehicleNo, row.bayName, row.camera, `"${row.entryTime}"`, `"${row.exitTime}"`, row.bayTime, row.standardTime];
                    break;
                case 'overstay':
                    headers = ['S.No', 'Title', 'Description', 'Vehicle Number', 'Bay Name', 'Camera Name', 'Entry Time', 'Exit Time', 'Overstay Duration', 'Standard Time'];
                    rowData = [row.sNo, `"${row.title}"`, `"${row.description}"`, row.vehicleNo, row.bayName, row.camera, `"${row.entryTime}"`, `"${row.exitTime}"`, row.overstayDuration, row.standardTime];
                    break;
                case 'parking-visibility':
                    headers = ['S.No', 'Title', 'Description', 'Vehicle Number', 'Bay Name', 'Camera Name', 'Timestamp', 'Status'];
                    rowData = [row.sNo, `"${row.title}"`, `"${row.description}"`, row.vehicleNo, row.bayName, row.camera, `"${row.timestamp}"`, row.status];
                    break;
                case 'gun-boot':
                case 'sop-violation':
                case 'gun-cut':
                case 'gun-twice':
                    headers = ['S.No', 'Vehicle Number', 'Bay Name', 'Camera Name', 'Title', 'Description', 'Timestamp'];
                    rowData = [row.sNo, row.vehicleNo, row.bayName, row.camera, `"${row.title}"`, `"${row.description}"`, `"${row.timestamp}"`];
                    break;
                case 'fire-smoke':
                case 'smoking':
                case 'animal':
                case 'garbage':
                case 'water':
                case 'lighting':
                    headers = ['S.No', 'Camera Name', 'Bay Name', 'Current Vehicle Number', 'Title', 'Description', 'Timestamp'];
                    rowData = [row.sNo, row.camera, row.bayName, row.vehicleNo, `"${row.title}"`, `"${row.description}"`, `"${row.timestamp}"`];
                    break;
                default:
                    headers = ['S.No', 'Camera', 'Title', 'Description', 'Timestamp'];
                    rowData = [row.sNo, row.camera, `"${row.title}"`, `"${row.description}"`, `"${row.timestamp}"`];
            }
            return rowData;
        });

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        // Create Blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${activeTab}_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate elapsed time helper
    const getElapsedTime = (rawTimestamp) => {
        if (!rawTimestamp) return '-';
        const now = dayjs();
        const diffInMinutes = now.diff(rawTimestamp, 'minute');

        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        const mins = diffInMinutes % 60;
        return `${diffInHours}h ${mins}m`;
    };

    const getColumns = (tabKey) => {
        const cSNo = { title: 'S.No', dataIndex: 'sNo', key: 'sNo', width: columnWidths['sNo'] || 70 };
        const cCamera = { title: 'Camera Name', dataIndex: 'camera', key: 'camera', width: columnWidths['camera'] || 130 };
        const cBay = { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', width: columnWidths['bayName'] || 100 };
        const cTitle = { title: 'Title', dataIndex: 'title', key: 'title', width: columnWidths['title'] || 200 };
        const cDesc = { title: 'Description', dataIndex: 'description', key: 'description', width: columnWidths['description'] || 250 };
        const cVehicle = { 
            title: 'Current Vehicle.No', 
            dataIndex: 'vehicleNo', 
            key: 'vehicleNo', 
            width: columnWidths['vehicleNo'] || 150,
            render: (text) => (
                <span className={text !== 'N/A' ? 'text-[#1e2d5b] font-bold' : 'text-gray-400'}>
                    {text}
                </span>
            )
        };
        const cTimestamp = { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', width: columnWidths['timestamp'] || 180 };
        
        const cStatus = {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: columnWidths['status'] || 100,
            render: (text) => (
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${text === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {text}
                </span>
            )
        };
        const cElapsed = {
            title: 'Elapsed Time',
            key: 'elapsed',
            width: columnWidths['elapsed'] || 120,
            render: (_, record) => (
                <span className="font-semibold text-gray-600">
                    {getElapsedTime(record.rawTimestamp)}
                </span>
            )
        };
        const cResolved = {
            title: 'Resolved At',
            dataIndex: 'resolvedAt',
            key: 'resolvedAt',
            width: columnWidths['resolvedAt'] || 180,
            render: (text) => text ? <span className="text-gray-600">{text}</span> : <span className="text-gray-400">-</span>
        };
        
        const cImage = {
            title: 'Incident Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: columnWidths['imageUrl'] || 120,
            render: (url) => (
                <Image
                    width={40}
                    height={40}
                    src={url}
                    className="rounded-md object-cover cursor-pointer"
                    preview={{ maskClassName: "rounded-md", src: url }}
                />
            )
        };

        const cEntryTime = { title: 'Entry Time', dataIndex: 'entryTime', key: 'entryTime', width: columnWidths['entryTime'] || 180 };
        const cExitTime = { title: 'Exit Time', dataIndex: 'exitTime', key: 'exitTime', width: columnWidths['exitTime'] || 180 };
        const cBayTime = { title: 'Time Elapsed / Bay Time', dataIndex: 'bayTime', key: 'bayTime', width: columnWidths['bayTime'] || 180 };
        const cStandardTime = { title: 'Standard Time', dataIndex: 'standardTime', key: 'standardTime', width: columnWidths['standardTime'] || 130 };
        const cOverstay = { title: 'Overstay Duration', dataIndex: 'overstayDuration', key: 'overstayDuration', width: columnWidths['overstayDuration'] || 150 };

        switch(tabKey) {
            case 'cam-deviation':
                return [cSNo, cCamera, cBay, cTitle, cDesc, cStatus, cTimestamp, cElapsed, cResolved, cImage];
            case 'unauth-presence':
                return [cSNo, cCamera, cBay, cVehicle, cTitle, cDesc, cTimestamp, cImage];
            case 'fence-breach':
                return [cSNo, cCamera, cBay, cTitle, cDesc, cTimestamp, cImage];
            case 'cam-tampering':
                return [cSNo, cCamera, cTitle, cDesc, cTimestamp, cImage];
            case 'cam-off':
                return [cSNo, cCamera, cTitle, cDesc, cStatus, cTimestamp, cElapsed, cResolved, cImage];
            case 'ev-id':
                return [cSNo, cTitle, cDesc, cVehicle, cBay, cCamera, cEntryTime, cExitTime, cBayTime, cStandardTime];
            case 'overstay':
                return [cSNo, cTitle, cDesc, cVehicle, cBay, cCamera, cEntryTime, cExitTime, cOverstay, cStandardTime];
            case 'parking-visibility':
                return [cSNo, cTitle, cDesc, cVehicle, cBay, cCamera, cTimestamp, cStatus, cImage];
            case 'gun-boot':
            case 'sop-violation':
            case 'gun-cut':
            case 'gun-twice':
                return [cSNo, cVehicle, cBay, cCamera, cTitle, cDesc, cTimestamp, cImage];
            case 'fire-smoke':
            case 'smoking':
            case 'animal':
            case 'garbage':
            case 'water':
            case 'lighting':
                return [cSNo, cCamera, cBay, cVehicle, cTitle, cDesc, cTimestamp, cImage];
            default:
                return [cSNo, cCamera, cTitle, cDesc, cTimestamp];
        }
    };

    const baseColumns = getColumns(activeTab);

    // Apply DraggableHeaderCell
    const mergedColumns = baseColumns.map((col) => {
        return {
            ...col,
            onHeaderCell: (column) => ({
                width: column.width,
                onResize: (deltaX) => handleResize(column.key, deltaX),
            }),
        };
    });

    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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



            {/* Tabs (Outside the white box) */}
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabs.map(t => ({
                    key: t.key,
                    label: (
                        <span className="flex items-center gap-2 px-2 text-[15px] font-semibold">
                            {t.icon}
                            {t.label}
                        </span>
                    )
                }))}
                className="modern-tabs mb-4"
            />


            {/* Filters & Export (Outside the white box) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div className="flex flex-col md:flex-row gap-4">
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
                            className="border-gray-300"
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
                            className="border-gray-300"
                        />
                    </div>
                </div>

                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-[#1e2d5b] hover:scale-105 duration-200 transition-all cursor-pointer text-white h-11 px-5 font-semibold rounded-lg shadow-md w-full md:w-auto"
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* White Box for Table and Pagination */}
            <div className="w-full bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">

                {/* Table */}
                <Table
                    columns={mergedColumns}
                    dataSource={paginatedData}
                    className="custom-table"
                    components={{
                        header: {
                            cell: DraggableHeaderCell,
                        },
                    }}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />

                {/* Custom Pagination */}
                {/* <div className="flex flex-col md:flex-row justify-start md:justify-between items-center gap-6 md:gap-0 mt-6 px-2 border-t border-gray-100 pt-4">
                    <div className="text-sm text-[#898989] flex items-center gap-2">
                        <span>Showing:</span>
                        <CustomDropdown
                            values={["5", "10", "25", "50", "100", "500"]}
                            width={70}
                            height={32}
                            selectedValue={pageSize.toString()}
                            onValueChange={(e) => handlePageChange(1, parseInt(e))}
                        />
                        <span>Items</span>
                    </div>

                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        className="custom-pagination"
                    />
                </div> */}

                <div className="flex flex-col md:flex-row justify-start md:justify-between items-center gap-6 md:gap-0 mt-4 px-2">
                    <div className="text-sm  text-[#898989] flex items-center gap-2">
                        <span>Showing:</span>
                        <CustomDropdown
                            values={["5", "10", "25", "50", "100", "500"]}
                            width={60}
                            height={25}
                            selectedValue={pageSize}
                            onValueChange={(e) => handlePageChange(1, parseInt(e))}
                        />
                        <span>Items</span>
                    </div>

                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        className="custom-pagination"
                    />
                </div>

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
            </div>
        </ConfigProvider>
    );
};

export default CommonAlertTable;
