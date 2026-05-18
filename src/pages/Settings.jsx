import React, { useState } from 'react';
import { Tabs, ConfigProvider, Table, message, Switch, Popover, Tooltip, Button, Empty } from 'antd';
import { Settings as SettingsIcon, Video, Map, Search, Edit2 } from 'lucide-react';
import CenterPopup from '../components/Modals/CenterPopup';
import CustomDropdown from '../components/Dropdowns/CustomDropdown';
import VideoWithROI from './VideoWithROI';

const initialZones = [
    { id: 1, zoneName: 'ENTRY_GATE', entryEvent: 'GATE_ENTER', exitEvent: 'GATE_EXIT', zoneType: 'Both' },
    { id: 2, zoneName: 'BAY_01', entryEvent: 'BAY_ENTER', exitEvent: 'BAY_EXIT', zoneType: 'Vehicle Detection' },
    { id: 3, zoneName: 'BAY_02', entryEvent: 'BAY_ENTER', exitEvent: 'BAY_EXIT', zoneType: 'Incident Surveillance' },
];

const initialCameras = [
    { sk: 'cam_1', cameraName: 'Gate Camera', enabled: true, health: true, channelNo: '1', ROIs: [], videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { sk: 'cam_2', cameraName: 'Bay 1 Camera', enabled: true, health: false, channelNo: '2', ROIs: [{ id: 'roi_1', data: { name: 'Parking Bay 1' }, points: [{ x: 50, y: 50 }, { x: 100, y: 50 }, { x: 100, y: 100 }, { x: 50, y: 100 }] }], videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const directionList = [
    "Towards North",
    "Towards South",
    "Towards East",
    "Towards West",
    "Towards North-East",
    "Towards North-West",
    "Towards South-East",
    "Towards South-West",
];

const categoryData = [
    { categoryName: "Instantaneous" },
    { categoryName: "Monitoring" },
];

function ZoneConfiguration() {
    const [zones, setZones] = useState(initialZones);
    const [deletePopup, setDeletePopup] = useState(false);
    const [modifyPopup, setModifyPopup] = useState(false);
    const [addPopup, setAddPopup] = useState(false);
    const [clicked, setClicked] = useState(null);
    const [formData, setFormData] = useState({
        zoneName: "",
        entryEvent: "",
        exitEvent: "",
        zoneType: "Vehicle Detection",
    });

    const resetForm = () => {
        setFormData({ zoneName: "", entryEvent: "", exitEvent: "", zoneType: "Vehicle Detection" });
    };

    const confirmDeletion = () => {
        setZones(zones.filter(z => z.id !== clicked.id));
        setDeletePopup(false);
        setClicked(null);
        message.success("Zone deleted successfully!");
    };

    const handleCreate = () => {
        setZones([...zones, { id: Date.now(), ...formData }]);
        resetForm();
        setAddPopup(false);
        message.success("Zone created successfully!");
    };

    const handleUpdate = () => {
        setZones(zones.map(z => z.id === clicked.id ? { ...z, ...formData } : z));
        resetForm();
        setModifyPopup(false);
        setClicked(null);
        message.success("Zone updated successfully!");
    };

    const handleModifyZone = (record) => {
        setFormData({ zoneName: record.zoneName, entryEvent: record.entryEvent, exitEvent: record.exitEvent, zoneType: record.zoneType || "Vehicle Detection" });
        setClicked(record);
        setModifyPopup(true);
    };

    const handleDeleteZone = (record) => {
        setClicked(record);
        setDeletePopup(true);
    };

    const columns = [
        {
            title: "S.No",
            render: (_, record, index) => index + 1,
            width: 66,
        },
        {
            title: "Zone Name",
            dataIndex: "zoneName",
        },
        {
            title: "Entry Event",
            dataIndex: "entryEvent",
        },
        {
            title: "Exit Event",
            dataIndex: "exitEvent",
        },
        {
            title: "Zone Type",
            dataIndex: "zoneType",
        },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={() => handleModifyZone(record)}
                        className="text-[#2D3394] cursor-pointer border border-[#2D3394] px-3 py-1 rounded-md text-sm font-medium hover:bg-[#2D3394] hover:text-white transition-all duration-300"
                    >
                        Modify
                    </button>

                    <button
                        onClick={() => handleDeleteZone(record)}
                        className="text-[#2D3394] cursor-pointer border border-[#2D3394] px-3 py-1 rounded-md text-sm font-medium hover:bg-[#2D3394] hover:text-white transition-all duration-300"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="mt-2">
            <div className="mb-5 flex flex-row justify-between items-center">
                <div className="text-gray-800 text-lg font-semibold">
                    Station Zone Configuration
                </div>
                <button
                    onClick={() => { resetForm(); setAddPopup(true); }}
                    className="bg-[#1e2d5b] hover:bg-[#152042] transition-colors duration-200 cursor-pointer text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm"
                >
                    + Create New Zone
                </button>
            </div>

            <Table
                columns={columns}
                dataSource={zones}
                rowKey="id"
                pagination={false}
                className="custom-table border border-gray-200 rounded-2xl overflow-hidden p-4 bg-white"
            />

            <CenterPopup isOpen={deletePopup} onClose={() => setDeletePopup(false)} width="w-[500px]">
                <div className="flex flex-col justify-center items-center p-4">
                    <div className="text-xl font-semibold text-center text-gray-800">
                        Are you sure you want to proceed?
                    </div>
                    <p className="mt-3 text-sm text-gray-500 text-center font-medium leading-relaxed">
                        This will permanently delete the zone. New events from it will not appear on the dashboard. Continue with caution.
                    </p>
                    <div className="flex flex-row mt-8 justify-center items-center gap-4">
                        <button className="bg-[#1e2d5b] hover:bg-[#152042] transition-colors text-white px-3 text-sm py-2.5 rounded-md font-medium w-32" onClick={confirmDeletion}>
                            Continue
                        </button>
                        <button className="text-[#1e2d5b] border border-[#1e2d5b] hover:bg-gray-50 transition-colors w-32 px-3 text-sm py-2.5 rounded-md font-medium" onClick={() => { setClicked(null); setDeletePopup(false); }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </CenterPopup>

            <CenterPopup isOpen={modifyPopup} onClose={() => setModifyPopup(false)} width="w-1/2">
                <div className="p-2">
                    <div className="text-xl font-semibold text-gray-800 mb-1">Modify Zone</div>
                    <p className="text-xs text-gray-500 mb-6 tracking-tight leading-relaxed">
                        Modify this zone within the service station by specifying its name and the corresponding entry and exit event names.
                    </p>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Zone Name</label>
                            <input type="text" value={formData.zoneName} onChange={(e) => setFormData({ ...formData, zoneName: e.target.value.toUpperCase() })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">In Direction Event Name</label>
                            <input type="text" value={formData.entryEvent} onChange={(e) => setFormData({ ...formData, entryEvent: e.target.value.toUpperCase() })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Out Direction Event Name</label>
                            <input type="text" value={formData.exitEvent} onChange={(e) => setFormData({ ...formData, exitEvent: e.target.value.toUpperCase() })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Zone Type</label>
                            <select value={formData.zoneType} onChange={(e) => setFormData({ ...formData, zoneType: e.target.value })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]">
                                <option value="Vehicle Detection">Vehicle Detection</option>
                                <option value="Incident Surveillance">Incident Surveillance</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => { resetForm(); setModifyPopup(false); setClicked(null); }} className="px-5 py-2 text-sm border rounded-md text-[#1e2d5b] border-[#1e2d5b] font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleUpdate} className="px-5 py-2 text-sm bg-[#1e2d5b] text-white rounded-md font-medium hover:bg-[#152042] transition-colors">Save Changes</button>
                    </div>
                </div>
            </CenterPopup>

            <CenterPopup isOpen={addPopup} onClose={() => setAddPopup(false)} width="w-1/2">
                <div className="p-2">
                    <div className="text-xl font-semibold text-gray-800 mb-1">Create a New Zone</div>
                    <p className="text-xs text-gray-500 mb-6 tracking-tight leading-relaxed">
                        Define a new zone within the service station by specifying its name and the corresponding entry and exit event names.
                    </p>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Zone Name</label>
                            <input type="text" placeholder="Enter Zone Name" value={formData.zoneName} onChange={(e) => setFormData({ ...formData, zoneName: e.target.value.toUpperCase() })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Entry Event Name (In Direction)</label>
                            <input type="text" placeholder="E.g. GATE_ENTRY" value={formData.entryEvent} onChange={(e) => setFormData({ ...formData, entryEvent: e.target.value.toUpperCase() })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Exit Event Name (Out Direction)</label>
                            <input type="text" placeholder="E.g. GATE_EXIT" value={formData.exitEvent} onChange={(e) => setFormData({ ...formData, exitEvent: e.target.value.toUpperCase() })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Zone Type</label>
                            <select value={formData.zoneType} onChange={(e) => setFormData({ ...formData, zoneType: e.target.value })} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e2d5b]">
                                <option value="Vehicle Detection">Vehicle Detection</option>
                                <option value="Incident Surveillance">Incident Surveillance</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => { resetForm(); setAddPopup(false); }} className="px-5 py-2 text-sm border rounded-md text-[#1e2d5b] border-[#1e2d5b] font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleCreate} className="px-5 py-2 text-sm bg-[#1e2d5b] text-white rounded-md font-medium hover:bg-[#152042] transition-colors">Create</button>
                    </div>
                </div>
            </CenterPopup>
        </div>
    );
}

function CameraConfiguration() {
    const [cameras, setCameras] = useState(initialCameras);
    const [searchValue, setSearchValue] = useState("");
    const [renameCamPopup, setRenameCamPopup] = useState(false);
    const [roiPopup, setRoiPopup] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [roiList, setRoiList] = useState([]);
    const [tempROIs, setTempROIs] = useState([]);

    // Modify ROI state
    const [configureROIPopup, setConfigureROIPopup] = useState(false);
    const [selectedROI, setSelectedROI] = useState(null);

    // Create ROI state
    const [newRoiPopup, setNewRoiPopup] = useState(false);
    const [newRoiInfo, setNewRoiInfo] = useState(null);
    const [savingIndex, setSavingIndex] = useState(null);

    const handleRename = (camera) => {
        setSelectedCamera({ ...camera });
        setRenameCamPopup(true);
    };

    const handleUpdateCameraName = () => {
        setCameras(cameras.map(c => c.sk === selectedCamera.sk ? { ...c, cameraName: selectedCamera.cameraName } : c));
        message.success("Camera renamed successfully");
        setRenameCamPopup(false);
        setSelectedCamera(null);
    };

    const handleConfigureROIs = (camera) => {
        const mappedRois = (camera.ROIs || []).map(r => ({
            id: r.id,
            data: r.data,
            points: r.points
        }));
        setRoiList(mappedRois);
        setSelectedCamera(camera);
        setRoiPopup(true);
    };

    const handleDisable = (camera, status) => {
        setCameras(cameras.map(c => c.sk === camera.sk ? { ...c, enabled: status } : c));
        message.success(`Camera ${status ? "enabled" : "disabled"} successfully!`);
    };

    const handleSaveROIs = () => {
        const updatedCameras = cameras.map(c => {
            if (c.sk === selectedCamera.sk) {
                return { ...c, ROIs: [...roiList] };
            }
            return c;
        });
        setCameras(updatedCameras);
        message.success("ROIs synced successfully");
        setTempROIs([]);
        setRoiPopup(false);
        setSelectedCamera(null);
    };

    const handleRemoveROI = (name) => {
        if (name) {
            setRoiList(roiList.filter(item => item?.data?.name !== name));
        }
    };

    const openTempSaveRoiPopup = (points) => {
        setNewRoiInfo({
            name: "",
            values: JSON.stringify(points.map(p => [p.x, p.y])),
        });
        setNewRoiPopup(true);
    };

    const filteredCameras = cameras.filter(c => c.cameraName.toLowerCase().includes(searchValue.toLowerCase()));

    const columns = [
        {
            title: "S.No",
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: "Camera Name",
            dataIndex: "cameraName",
        },
        {
            title: "Health Status",
            render: (val) => (
                <div className={`${!val.enabled ? "text-gray-500" : val.health ? "text-green-500" : "text-red-500"} font-semibold text-xs`}>
                    {!val.enabled ? "DISABLED" : val.health ? "ONLINE" : "OFFLINE"}
                </div>
            ),
        },
        {
            title: "Activity",
            render: (val) => (
                <Switch checked={val?.enabled} onChange={(e) => handleDisable(val, e)} />
            ),
        },
        {
            title: "Channel No.",
            render: (val) => "Channel " + val.channelNo,
        },
        {
            title: "Actions",
            render: (val) => (
                <div className="flex flex-row justify-start items-center gap-2">
                    <Popover
                        placement="left"
                        content={
                            <div className="flex flex-wrap gap-2 max-w-40">
                                {val.ROIs?.length === 0 && <div className="text-sm font-medium whitespace-nowrap text-gray-500">No ROIs found</div>}
                                {val.ROIs?.map(roi => (
                                    <p key={roi.id} className="px-2 font-semibold py-0.5 text-xs bg-blue-50 rounded-full text-[#1e2d5b] border border-[#1e2d5b]">
                                        {roi?.data?.name || "Unnamed ROI"}
                                    </p>
                                ))}
                            </div>
                        }
                    >
                        <button className="border border-gray-300 rounded-md bg-white transition-all duration-300 hover:bg-gray-50 text-[13px] font-medium px-3 py-1.5 text-gray-700">
                            View ROIs
                        </button>
                    </Popover>
                    <button className="border border-gray-300 rounded-md bg-white transition-all duration-300 hover:bg-gray-50 text-[13px] font-medium px-3 py-1.5 text-gray-700" onClick={() => handleRename(val)}>
                        Rename
                    </button>
                    <button className="border border-[#1e2d5b] text-[#1e2d5b] rounded-md bg-white transition-all duration-300 hover:bg-[#1e2d5b] hover:text-white text-[13px] font-medium px-3 py-1.5" onClick={() => handleConfigureROIs(val)}>
                        Configure ROI
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="mt-2 w-full">
            <div className="flex flex-row justify-between items-center mb-5">
                <div className="font-semibold text-lg text-gray-800">
                    Configure Cameras & ROIs
                </div>
                <div className="w-80 h-10 bg-white border flex flex-row items-center justify-start rounded-md border-gray-300 px-2 shadow-sm focus-within:ring-2 ring-[#1e2d5b]">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input type="text" placeholder="Search by Camera name..." className="text-sm text-gray-700 font-medium w-full outline-none" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredCameras}
                rowKey="sk"
                pagination={false}
                className="custom-table border border-gray-200 rounded-2xl p-4 overflow-hidden bg-white shadow-sm"
            />

            <CenterPopup isOpen={renameCamPopup} onClose={() => { setRenameCamPopup(false); setSelectedCamera(null); }} width="w-[600px]">
                <div className="p-2">
                    <div className="font-semibold text-xl text-gray-800 mb-2">Modify Camera Name</div>
                    <div className="text-sm text-gray-500 mb-6">Enter the updated camera name and click on the <strong>Rename</strong> button below to save the changes.</div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Enter the Updated Camera Name:</label>
                    <input type="text" value={selectedCamera?.cameraName || ''} placeholder="Enter the camera name here" className="rounded-lg border border-gray-300 w-full h-11 bg-white px-3 mt-1 mb-4 outline-none focus:ring-2 focus:ring-[#1e2d5b] text-sm" onChange={(e) => setSelectedCamera({ ...selectedCamera, cameraName: e.target.value })} />
                    <div className="mt-6 flex justify-end gap-3">
                        <button className="h-11 rounded-lg border border-[#1e2d5b] text-[#1e2d5b] text-sm font-medium px-6 hover:bg-gray-50 transition-colors" onClick={() => { setRenameCamPopup(false); setSelectedCamera(null); }}>Cancel</button>
                        <button className="h-11 rounded-lg bg-[#1e2d5b] text-white text-sm font-medium px-6 hover:bg-[#152042] transition-colors" onClick={handleUpdateCameraName}>Rename</button>
                    </div>
                </div>
            </CenterPopup>

            <CenterPopup isOpen={roiPopup} onClose={() => { setRoiPopup(false); setSelectedCamera(null); }} width="w-[95vw] max-w-[1400px]">
                <div className="grid grid-cols-12 gap-6 h-[80vh]">
                    <div className="col-span-12 flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-1.5 rounded-full bg-[#1e2d5b]" />
                            <div className="font-semibold text-xl text-gray-800 tracking-tight uppercase">{selectedCamera?.cameraName}</div>
                            <div className="bg-[#1e2d5b] text-white px-3 py-1 rounded-full text-xs font-medium ml-2">Channel {selectedCamera?.channelNo}</div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-8 flex flex-col">
                        <VideoWithROI
                            video="https://media.istockphoto.com/id/1334725337/video/young-man-charges-his-electric-car-with-blue-energy-at-dusk.mp4?s=mp4-640x640-is&k=20&c=uhu0QNLgyvjetzJwNyviUfVqhVceNZV2bIuHnoDjGBk="
                            initialROIs={roiList}
                            onDelete={handleRemoveROI}
                            saveTempROI={openTempSaveRoiPopup}
                            tempROIs={tempROIs}
                            setTempROIs={setTempROIs}
                        />
                        <div className="mt-4 flex items-center gap-6">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" /> <span className="text-sm font-medium text-gray-600">Saved ROI</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" /> <span className="text-sm font-medium text-gray-600">In Progress ROI</span></div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 flex flex-col justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex-1 overflow-auto">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="font-semibold text-gray-800 text-sm tracking-wide uppercase">Regions of Interest</div>
                            </div>

                            {roiList?.length > 0 ? (
                                <Table
                                    size="small"
                                    className="bg-white rounded-lg border border-gray-200"
                                    dataSource={roiList}
                                    pagination={false}
                                    rowKey="id"
                                    columns={[
                                        {
                                            title: "ROI Details",
                                            dataIndex: "data",
                                            render: (data) => (
                                                <div className="flex flex-col">
                                                    <div className="font-semibold text-xs text-gray-800">{data?.name || "Unnamed ROI"}</div>
                                                    <div className="flex gap-1 mt-1">
                                                        <span className="text-[10px] bg-[#1e2d5b] text-white px-2 py-0.5 rounded-full">{data?.direction || "No Dir"}</span>
                                                        <span className="text-[10px] bg-gray-600 text-white px-2 py-0.5 rounded-full">{data?.zone || "No Zone"}</span>
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            title: "Type",
                                            dataIndex: "data",
                                            width: 80,
                                            render: (data) => <span className="text-xs font-medium text-gray-600">{data?.category || "N/A"}</span>
                                        },
                                        {
                                            title: "",
                                            width: 40,
                                            render: (_, record) => !record.temp && (
                                                <Tooltip title="Modify ROI">
                                                    <Button type="text" icon={<Edit2 size={14} className="text-[#1e2d5b]" />} onClick={() => { setConfigureROIPopup(true); setSelectedROI({ id: record.id, ...record.data }); }} />
                                                </Tooltip>
                                            )
                                        }
                                    ]}
                                />
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-sm text-gray-500">No ROIs configured yet.</span>} />
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button className="h-11 rounded-lg border border-[#1e2d5b] text-[#1e2d5b] text-sm font-medium px-6 hover:bg-gray-100 transition-colors" onClick={() => { setRoiPopup(false); setSelectedCamera(null); }}>Cancel</button>
                            <button className="h-11 rounded-lg bg-[#1e2d5b] text-white text-sm font-medium px-6 hover:bg-[#152042] transition-colors" onClick={handleSaveROIs}>Save All ROIs</button>
                        </div>
                    </div>
                </div>
            </CenterPopup>

            <CenterPopup isOpen={configureROIPopup} onClose={() => { setConfigureROIPopup(false); setSelectedROI(null); }} width="w-[700px]">
                <div className="p-2">
                    <div className="font-semibold text-xl text-[#1e2d5b] mb-4">Modify ROI Details</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-700 block mb-1">ROI Name</label>
                            <input type="text" value={selectedROI?.name || ''} className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-[#1e2d5b] outline-none" onChange={(e) => setSelectedROI({ ...selectedROI, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">ROI Zone</label>
                            <CustomDropdown values={initialZones.map(z => z.zoneName)} width="100%" height={40} selectedValue={selectedROI?.zone} onValueChange={(val) => setSelectedROI({ ...selectedROI, zone: val })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                            <CustomDropdown values={categoryData.map(c => c.categoryName)} width="100%" height={40} selectedValue={selectedROI?.category} onValueChange={(val) => setSelectedROI({ ...selectedROI, category: val })} />
                        </div>
                        <div className="col-span-2 relative">
                            <label className="text-sm font-medium text-gray-700 block mb-1">Vehicle IN Directionality</label>
                            <CustomDropdown values={directionList} width="100%" height={40} selectedValue={selectedROI?.direction} onValueChange={(val) => setSelectedROI({ ...selectedROI, direction: val })} />
                            {/* <img src="https://cdn-icons-png.flaticon.com/512/3050/3050486.png" className="w-20 h-20 absolute -top-8 right-4 opacity-50" alt="compass" /> */}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button className="h-10 border border-[#1e2d5b] text-[#1e2d5b] rounded-lg px-6 font-medium text-sm hover:bg-gray-50" onClick={() => setConfigureROIPopup(false)}>Cancel</button>
                        <button className="h-10 bg-[#1e2d5b] text-white rounded-lg px-6 font-medium text-sm hover:bg-[#152042]" onClick={() => {
                            setRoiList(prev => prev.map(roi => roi.id === selectedROI.id ? { ...roi, data: { ...roi.data, ...selectedROI } } : roi));
                            setConfigureROIPopup(false);
                            setSelectedROI(null);
                        }}>Save Changes</button>
                    </div>
                </div>
            </CenterPopup>

            <CenterPopup isOpen={newRoiPopup} onClose={() => { setNewRoiPopup(false); setNewRoiInfo(null); }} width="w-[700px]">
                <div className="p-2">
                    <div className="font-semibold text-xl text-[#1e2d5b] mb-4">Create New ROI</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-700 block mb-1">ROI Name</label>
                            <input type="text" placeholder="Enter ROI Name" value={newRoiInfo?.name || ''} className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-[#1e2d5b] outline-none" onChange={(e) => setNewRoiInfo({ ...newRoiInfo, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">ROI Zone</label>
                            <CustomDropdown values={initialZones.map(z => z.zoneName)} width="100%" height={40} selectedValue={newRoiInfo?.zone} onValueChange={(val) => setNewRoiInfo({ ...newRoiInfo, zone: val })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                            <CustomDropdown values={categoryData.map(c => c.categoryName)} width="100%" height={40} selectedValue={newRoiInfo?.category} onValueChange={(val) => setNewRoiInfo({ ...newRoiInfo, category: val })} />
                        </div>
                        <div className="col-span-2 relative">
                            <label className="text-sm font-medium text-gray-700 block mb-1">Vehicle IN Directionality</label>
                            <CustomDropdown values={directionList} width="100%" height={40} selectedValue={newRoiInfo?.direction} onValueChange={(val) => setNewRoiInfo({ ...newRoiInfo, direction: val })} />
                            {/* <img src="https://cdn-icons-png.flaticon.com/512/3050/3050486.png" className="w-20 h-20 absolute -top-8 right-4 opacity-50" alt="compass" /> */}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button className="h-10 border border-[#1e2d5b] text-[#1e2d5b] rounded-lg px-6 font-medium text-sm hover:bg-gray-50" onClick={() => { setNewRoiPopup(false); setNewRoiInfo(null); }}>Cancel</button>
                        <button className="h-10 bg-[#1e2d5b] text-white rounded-lg px-6 font-medium text-sm hover:bg-[#152042]" onClick={() => {
                            setRoiList([...roiList, { id: Date.now().toString(), data: newRoiInfo, temp: true, points: JSON.parse(newRoiInfo.values).map(p => ({ x: p[0], y: p[1] })) }]);
                            setNewRoiPopup(false);
                            setNewRoiInfo(null);
                        }}>Add ROI</button>
                    </div>
                </div>
            </CenterPopup>
        </div>
    );
}

function Settings() {
    const [activeTab, setActiveTab] = useState('camera-config');

    const items = [
        {
            key: 'zone-config',
            label: (
                <span className="flex items-center gap-2 px-2 text-[15px] font-semibold">
                    <Map size={18} />
                    Zone Configuration
                </span>
            ),
            children: (
                <div className="w-full min-h-[400px]">
                    <ZoneConfiguration />
                </div>
            )
        },
        {
            key: 'camera-config',
            label: (
                <span className="flex items-center gap-2 px-2 text-[15px] font-semibold">
                    <Video size={18} />
                    Camera Configuration
                </span>
            ),

            children: (
                <div className="w-full min-h-[400px]">
                    <CameraConfiguration />
                </div>
            )
        }
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1e2d5b',
                },
            }}
        >
            <div className='w-full max-w-[1400px] mx-auto'>
                <div className="mb-6">
                    <div className="text-xl xl:text-3xl tracking-tight text-gray-800 font-semibold flex items-center gap-3">
                        <SettingsIcon size={28} className="text-[#1e2d5b]" />
                        Settings
                    </div>
                    <p className="text-sm text-gray-500 mt-1 tracking-tight">
                        Configure station zones and manage camera mapping.
                    </p>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                    className="modern-tabs"
                />
            </div>
        </ConfigProvider>
    );
}

export default Settings;
