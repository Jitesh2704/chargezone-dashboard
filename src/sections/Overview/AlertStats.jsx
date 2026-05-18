import React, { useState } from 'react';
import { Modal, Table, Button, Pagination, ConfigProvider, Image } from 'antd';
import CustomDropdown from "../../components/Dropdowns/CustomDropdown";
import CenterPopup from "../../components/Modals/CenterPopUp";
import {
    Camera, UserX, CarFront, Fence,
    Wrench, EyeOff, Unplug, ZapOff,
    VideoOff, Eye, Flame, Ban,
    Snail, Droplets, Lightbulb, X
} from 'lucide-react';

const alertCategories = [
    { id: 'cam-dev', title: 'Camera Deviation', count: 2, icon: Camera, bg: 'bg-red-50', color: 'text-red-500' },
    { id: 'unauth-pres', title: 'Unauthorized Presence', count: 5, icon: UserX, bg: 'bg-orange-50', color: 'text-orange-500' },
    { id: 'unauth-park', title: 'Unauthorized Parking', count: 12, icon: CarFront, bg: 'bg-blue-50', color: 'text-blue-500' },
    { id: 'fence', title: 'Fence Breach', count: 0, icon: Fence, bg: 'bg-red-50', color: 'text-red-500' },
    { id: 'gun-mis', title: 'Gun Misplacement', count: 3, icon: Wrench, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    { id: 'loiter', title: 'Loitering Detection', count: 1, icon: EyeOff, bg: 'bg-purple-50', color: 'text-purple-500' },
    { id: 'gun-dmg', title: 'Charging Gun Damage', count: 0, icon: Unplug, bg: 'bg-red-50', color: 'text-red-600' },
    { id: 'gun-misuse', title: 'Gun Misuse', count: 4, icon: ZapOff, bg: 'bg-orange-50', color: 'text-orange-600' },
    { id: 'cam-off', title: 'Offline Cameras', count: 1, icon: VideoOff, bg: 'bg-gray-100', color: 'text-gray-600' },
    { id: 'bay-vis', title: 'Bay Visibility', count: 0, icon: Eye, bg: 'bg-blue-50', color: 'text-blue-500' },
    { id: 'fire', title: 'Smoke/Fire Detection', count: 0, icon: Flame, bg: 'bg-red-100', color: 'text-red-600' },
    { id: 'smoking', title: 'Smoking & Spitting', count: 2, icon: Ban, bg: 'bg-orange-50', color: 'text-orange-500' },
    { id: 'cattle', title: 'Cattle Detection', count: 6, icon: Snail, bg: 'bg-green-50', color: 'text-green-600' },
    { id: 'water', title: 'Water Logging', count: 0, icon: Droplets, bg: 'bg-blue-50', color: 'text-blue-600' },
    { id: 'lighting', title: 'Canopy Lighting', count: 0, icon: Lightbulb, bg: 'bg-yellow-50', color: 'text-yellow-500' },
];

// Common Table Component tailored for Tailwind
const GenericAlertTable = ({ data, columns }) => {
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

function AlertStats() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    const handleBoxClick = (alert) => {
        setSelectedAlert(alert);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedAlert(null);
    };

    // Dummy data generator based on alert type
    const getDummyData = (title) => {
        return Array.from({ length: 5 }).map((_, i) => {
            const baseData = {
                key: i,
                sNo: i + 1,
                timestamp: `12th May 2026 10:0${i} AM`,
                imageUrl: `https://picsum.photos/seed/${title.replace(/ /g, '')}${i}/800/600`,
                bayName: `Bay 0${(i % 3) + 1}`,
                cameraName: `Cam-0${(i % 4) + 1}`,
                currentVehicle: i % 2 === 0 ? `MH12 AB ${1000 + i}` : 'N/A',
                vehicleType: i % 2 === 0 ? 'EV' : 'Non EV',
                status: i % 2 === 0 ? 'Active' : 'Resolved',
            };

            switch (title) {
                case 'Unauthorized Parking':
                    return {
                        ...baseData,
                        parkedVehicleNo: `MH12 AB ${2000 + i}`,
                        elapsedTime: `${15 + i * 10} mins`,
                    };
                case 'Bay Visibility':
                    return {
                        ...baseData,
                        description: `Visibility reduced due to obstacle at zone ${i + 1}`
                    };
                default:
                    return { ...baseData };
            }
        });
    };

    const renderImage = (url) => (
        <Image
            width={40}
            height={40}
            src={url}
            className="rounded-md object-cover cursor-pointer"
            preview={{ maskClassName: "rounded-md", src: url }}
        />
    );

    const getColumns = (title) => {
        const imageCol = {
            title: 'Incident Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: renderImage
        };

        const statusCol = {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${text === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {text}
                </span>
            )
        };

        switch (title) {
            case 'Camera Deviation':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Camera Name', dataIndex: 'cameraName', key: 'cameraName', className: 'font-medium' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName' },
                    { title: 'Deviation Detected At', dataIndex: 'timestamp', key: 'timestamp' },
                    statusCol
                ];
            case 'Unauthorized Presence':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Current Vehicle', dataIndex: 'currentVehicle', key: 'currentVehicle' },
                    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
                    imageCol
                ];
            case 'Unauthorized Parking':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Camera Name', dataIndex: 'cameraName', key: 'cameraName' },
                    { title: 'Parked Vehicle No', dataIndex: 'parkedVehicleNo', key: 'parkedVehicleNo' },
                    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
                    { title: 'Elapsed Time', dataIndex: 'elapsedTime', key: 'elapsedTime' },
                    { title: 'Vehicle Type', dataIndex: 'vehicleType', key: 'vehicleType' }
                ];
            case 'Fence Breach':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Camera Name', dataIndex: 'cameraName', key: 'cameraName', className: 'font-medium' },
                    { title: 'Incident Time', dataIndex: 'timestamp', key: 'timestamp' },
                    imageCol
                ];
            case 'Gun Misplacement':
            case 'Loitering Detection':
            case 'Charging Gun Damage':
            case 'Gun Misuse':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Current Vehicle', dataIndex: 'currentVehicle', key: 'currentVehicle' },
                    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
                    { title: 'Vehicle Type', dataIndex: 'vehicleType', key: 'vehicleType' },
                    imageCol
                ];
            case 'Offline Cameras':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Camera Name', dataIndex: 'cameraName', key: 'cameraName', className: 'font-medium' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName' },
                    { title: 'Offline Since', dataIndex: 'timestamp', key: 'timestamp' },
                    statusCol
                ];
            case 'Bay Visibility':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Current Vehicle', dataIndex: 'currentVehicle', key: 'currentVehicle' },
                    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
                    { title: 'Description', dataIndex: 'description', key: 'description' },
                    imageCol
                ];
            case 'Smoke/Fire Detection':
            case 'Smoking & Spitting':
            case 'Cattle Detection':
            case 'Water Logging':
            case 'Canopy Lighting':
                return [
                    { title: 'S.No', dataIndex: 'sNo', key: 'sNo' },
                    { title: 'Bay Name', dataIndex: 'bayName', key: 'bayName', className: 'font-medium' },
                    { title: 'Camera Name', dataIndex: 'cameraName', key: 'cameraName' },
                    { title: 'Current Vehicle', dataIndex: 'currentVehicle', key: 'currentVehicle' },
                    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
                    imageCol
                ];
            default:
                return [];
        }
    };

    return (
        <div className="w-full mt-6">
            <div className="grid grid-cols-10 gap-3 p-5 bg-white rounded-xl border-2 border-gray-200">
                <div className="col-span-10 text-2xl tracking-tight font-semibold text-gray-500">
                    Surveillance Incident Analytics
                </div>

                {alertCategories.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="col-span-10 sm:col-span-5 md:col-span-3 lg:col-span-2 bg-gray-50 rounded-xl border border-gray-200 p-4 relative hover:shadow-md transition-shadow duration-300"
                        >
                            <div className={`absolute top-3 right-3 ${item.bg} rounded-full p-2`}>
                                <Icon className={`${item.color} w-5 h-5`} strokeWidth={2.5} />
                            </div>
                            <div className="text-xs font-bold uppercase text-gray-500 leading-tight tracking-tight mt-1 pr-6">
                                {item.title}
                            </div>

                            <div
                                className="mt-3 text-3xl hover:text-[#1e2d5b] cursor-pointer transition-all duration-300 font-extrabold text-gray-900 inline-block"
                                onClick={() => handleBoxClick(item)}
                            >
                                {item.count}
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
                            {selectedAlert && <selectedAlert.icon className="w-6 h-6" />}
                            {selectedAlert?.title} Logs
                        </div>
                    </div>
                    <div className="mt-0">
                        {selectedAlert && (
                            <GenericAlertTable
                                data={getDummyData(selectedAlert.title)}
                                columns={getColumns(selectedAlert.title)}
                            />
                        )}
                    </div>
                </div>
            </CenterPopup>
        </div>
    );
}

export default AlertStats;