import React, { useState } from "react";
import { Modal, Table, Button, Pagination, ConfigProvider } from "antd";
import { Grid2x2, Car, Clock, Zap, AlertTriangle, X } from "lucide-react";
import CenterPopup from "../../components/Modals/CenterPopUp";
import CustomDropdown from "../../components/Dropdowns/CustomDropdown";

// Common Table Component tailored for Tailwind
const GenericBayTable = ({ data, columns }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const handlePageChange = (page, newPageSize) => {
        setCurrentPage(page);
        if (newPageSize) {
            setPageSize(newPageSize);
        }
    };

    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1e2d5b',
                },
            }}
        >
            <div className="w-full">
                <Table
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    className="custom-table"
                    scroll={{ x: 'max-content' }}
                />

                <div className="flex flex-col md:flex-row justify-start md:justify-between items-center gap-6 md:gap-0 mt-4 px-2">
                    <div className="text-sm text-[#898989] flex items-center gap-2">
                        <span>Showing:</span>
                        <CustomDropdown
                            values={["5"]}
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


function BayStats() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState(null);

    const bayCounts = [
        {
            title: "Total Bays",
            value: 12,
            icon: Grid2x2,
            bg: "bg-blue-100",
            color: "text-blue-600"
        },
        {
            title: "Total Occupied",
            value: 8,
            icon: Car,
            bg: "bg-green-100",
            color: "text-green-600"
        },
        {
            title: "Overstay Vehicles",
            value: 2,
            icon: Clock,
            bg: "bg-orange-100",
            color: "text-orange-600"
        },
        {
            title: "Avg Charge Time",
            value: "45m",
            icon: Zap,
            bg: "bg-purple-100",
            color: "text-purple-600"
        },
        {
            title: "Total Alerts",
            value: 5,
            icon: AlertTriangle,
            bg: "bg-red-100",
            color: "text-red-600"
        }
    ];

    const handleBoxClick = (stat) => {
        setSelectedStat(stat);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedStat(null);
    };

    // Dummy data generator based on stat title
    const getDummyData = (title) => {
        switch (title) {
            case "Total Bays":
                return Array.from({ length: 12 }).map((_, i) => {
                    const isOccupied = i % 3 !== 0;
                    return {
                        key: i,
                        sno: i + 1,
                        bayName: `Bay ${i + 1}`,
                        currentVehicle: isOccupied ? `MH12 AB ${1000 + i}` : '-',
                        entryTime: isOccupied ? `12th May 2026 10:${i < 10 ? '0' + i : i} AM` : '-',
                        elapsedTime: isOccupied ? `${30 + i} mins` : '-',
                        standardTime: '45 mins',
                        bayType: i % 2 === 0 ? 'DC Fast' : 'AC Normal',
                    };
                });
            case "Total Occupied":
                return Array.from({ length: 8 }).map((_, i) => ({
                    key: i,
                    sno: i + 1,
                    bayName: `Bay ${i + 1}`,
                    currentVehicle: `MH12 AB ${2000 + i}`,
                    entryTime: `12th May 2026 09:${i < 10 ? '0' + i : i} AM`,
                    elapsedTime: `${20 + i} mins`,
                    standardTime: '45 mins',
                    bayType: i % 2 === 0 ? 'DC Fast' : 'AC Normal',
                }));
            case "Overstay Vehicles":
                return Array.from({ length: 2 }).map((_, i) => ({
                    key: i,
                    sno: i + 1,
                    bayName: `Bay ${i + 5}`,
                    currentVehicle: `MH12 AB ${3000 + i}`,
                    entryTime: `12th May 2026 08:${i < 10 ? '0' + i : i} AM`,
                    elapsedTime: `${50 + i * 10} mins`,
                    standardTime: '45 mins',
                    bayType: 'DC Fast',
                    overStayTime: `${5 + i * 10} mins`,
                }));
            case "Avg Charge Time":
                return Array.from({ length: 5 }).map((_, i) => ({
                    key: i,
                    sno: i + 1,
                    bayName: `Bay ${i + 1}`,
                    vehicleNo: `MH12 AB ${4000 + i}`,
                    entryTime: `12th May 2026 07:${i < 10 ? '0' + i : i} AM`,
                    exitTime: `12th May 2026 08:${i < 10 ? '0' + i : i} AM`,
                    bayTime: '60 mins',
                    vehicleType: i % 2 === 0 ? 'EV' : 'Non EV',
                }));
            case "Total Alerts":
                return Array.from({ length: 5 }).map((_, i) => ({
                    key: i,
                    sno: i + 1,
                    incidentType: i % 2 === 0 ? 'Hardware' : 'Software',
                    title: i % 2 === 0 ? 'Connector Fault' : 'Network Disconnect',
                    description: i % 2 === 0 ? 'Connector 1 not responding' : 'Lost connection to gateway',
                    associatedWith: i % 2 === 0 ? 'Bay' : 'Camera',
                    timestamp: `12th May 2026 11:3${i} AM`,
                    status: i === 0 ? 'Active' : 'Resolved',
                }));
            default:
                return [];
        }
    };

    const getColumns = (title) => {
        switch (title) {
            case "Total Bays":
            case "Total Occupied":
                return [
                    { title: 'S.No', dataIndex: 'sno', key: 'sno' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Current Vehicle', dataIndex: 'currentVehicle', key: 'currentVehicle' },
                    { title: 'Entry Time', dataIndex: 'entryTime', key: 'entryTime' },
                    { title: 'Elapsed Time', dataIndex: 'elapsedTime', key: 'elapsedTime' },
                    { title: 'Standard Time', dataIndex: 'standardTime', key: 'standardTime' },
                    { title: 'Bay Type', dataIndex: 'bayType', key: 'bayType' },
                ];
            case "Overstay Vehicles":
                return [
                    { title: 'S.No', dataIndex: 'sno', key: 'sno' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Current Vehicle', dataIndex: 'currentVehicle', key: 'currentVehicle' },
                    { title: 'Entry Time', dataIndex: 'entryTime', key: 'entryTime' },
                    { title: 'Elapsed Time', dataIndex: 'elapsedTime', key: 'elapsedTime' },
                    { title: 'Standard Time', dataIndex: 'standardTime', key: 'standardTime' },
                    { title: 'Bay Type', dataIndex: 'bayType', key: 'bayType' },
                    { title: 'Over Stay Time', dataIndex: 'overStayTime', key: 'overStayTime', render: (text) => <span className="text-red-600 font-semibold">{text}</span> },
                ];
            case "Avg Charge Time":
                return [
                    { title: 'S.No', dataIndex: 'sno', key: 'sno' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Vehicle No', dataIndex: 'vehicleNo', key: 'vehicleNo' },
                    { title: 'Bay Entry Time', dataIndex: 'entryTime', key: 'entryTime' },
                    { title: 'Bay Exit Time', dataIndex: 'exitTime', key: 'exitTime' },
                    { title: 'Bay Time', dataIndex: 'bayTime', key: 'bayTime' },
                    { title: 'Vehicle Type', dataIndex: 'vehicleType', key: 'vehicleType' },
                ];
            case "Total Alerts":
                return [
                    { title: 'S.No', dataIndex: 'sno', key: 'sno' },
                    { title: 'Incident Type', dataIndex: 'incidentType', key: 'incidentType', className: 'font-semibold' },
                    { title: 'Title', dataIndex: 'title', key: 'title' },
                    { title: 'Description', dataIndex: 'description', key: 'description' },
                    { title: 'Associated With', dataIndex: 'associatedWith', key: 'associatedWith' },
                    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
                    {
                        title: 'Status', dataIndex: 'status', key: 'status', render: (text) => (
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${text === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {text}
                            </span>
                        )
                    },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-10 gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 ">
                <div className="col-span-10 text-2xl tracking-tight font-semibold text-gray-500">
                    Charge Bay Analytics
                </div> {bayCounts.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="col-span-10 md:col-span-5 xl:col-span-2 bg-gray-50 rounded-xl border border-gray-200 p-4 relative hover:shadow-md transition-shadow duration-300"
                        >
                            <div className={`absolute top-3 right-3 ${item.bg} rounded-full p-2`}>
                                <Icon className={`${item.color} w-5 h-5`} />
                            </div>
                            <div className="text-sm font-bold uppercase text-gray-500 leading-tight tracking-tight mt-1">
                                {item.title}
                            </div>
                            <div
                                className="mt-3 text-3xl hover:text-[#1e2d5b] cursor-pointer transition-all duration-300 font-extrabold text-gray-900 inline-block"
                                onClick={() => handleBoxClick(item)}
                            >
                                {item.value}
                            </div>
                        </div>
                    );
                })}
            </div>

            <CenterPopup
                isOpen={isModalOpen}
                onClose={handleClose}
                width="w-5/6"
                rounded="rounded-xl"
            >
                <div className="w-full flex flex-col gap-2">
                    <div className="font-semibold text-2xl leading-6 text-[#2D3394] mb-2">
                        <div className="flex items-center gap-2 text-[#1e2d5b] text-xl font-bold border-b border-gray-100 pb-3">
                            {selectedStat && <selectedStat.icon className="w-6 h-6" />}
                            {selectedStat?.title} Details
                        </div>
                    </div>
                    <div className="mt-0">
                        {selectedStat && (
                            <GenericBayTable
                                data={getDummyData(selectedStat.title)}
                                columns={getColumns(selectedStat.title)}
                            />
                        )}
                    </div>
                </div>
            </CenterPopup>

        </div>
    );
}

export default BayStats;