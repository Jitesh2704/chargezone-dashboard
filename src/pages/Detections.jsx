import React from 'react';
import { Camera, UserX, Fence, EyeOff, VideoOff } from 'lucide-react';
import CommonAlertTable from '../components/Tables/CommonAlertTable';

const detectionTabs = [
    { 
        key: 'cam-deviation', 
        label: 'Camera Deviation', 
        icon: <Camera size={18} />, 
        title: 'Camera Position Deviation',
        isResolvable: true 
    },
    { 
        key: 'unauth-presence', 
        label: 'Unauthorized Presence', 
        icon: <UserX size={18} />, 
        title: 'Unauthorized Human Presence',
        isResolvable: true
    },
    { 
        key: 'fence-breach', 
        label: 'Fence Breach', 
        icon: <Fence size={18} />, 
        title: 'Switchyard Fence Breach',
        isResolvable: true 
    },
    { 
        key: 'cam-tampering', 
        label: 'Camera Tampering', 
        icon: <EyeOff size={18} />, 
        title: 'Camera Tampering & Loitering',
        isResolvable: true 
    },
    { 
        key: 'cam-off', 
        label: 'Camera Offline (>10m)', 
        icon: <VideoOff size={18} />, 
        title: 'Camera Off for > 10 Mins',
        isResolvable: true 
    },
];

function Detections() {
    return (
        <div className='w-full max-w-[1400px] mx-auto'>
            <div className="mb-6">
                <div className="text-xl xl:text-3xl tracking-tight text-gray-800 font-semibold">
                    Detection & Security
                </div>
                <p className="text-sm text-gray-500 mt-1 tracking-tight">
                    Monitor unauthorized access, camera health, and perimeter breaches.
                </p>
            </div>
            
            <CommonAlertTable tabs={detectionTabs} />
        </div>
    );
}

export default Detections;
