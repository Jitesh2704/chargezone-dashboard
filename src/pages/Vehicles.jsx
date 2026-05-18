import React from 'react';
import { ThunderboltOutlined, ClockCircleOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import CommonAlertTable from '../components/Tables/CommonAlertTable';

const vehicleTabs = [
    { 
        key: 'ev-id', 
        label: 'Non-EV', 
        icon: <ThunderboltOutlined />, 
        title: 'EV & Non-EV Identification',
        isResolvable: true 
    },
    { 
        key: 'overstay', 
        label: 'Overstay Detection', 
        icon: <ClockCircleOutlined />, 
        title: 'Overstay Beyond Allowed Time',
        isResolvable: true 
    },
    { 
        key: 'parking-visibility', 
        label: 'Marking Visibility', 
        icon: <EyeInvisibleOutlined />, 
        title: 'EV Parking Marking Visibility',
        isResolvable: true 
    },
];

function Vehicles() {
    return (
        <div className='w-full max-w-[1400px] mx-auto'>
            <div className="mb-6">
                <div className="text-xl xl:text-3xl tracking-tight text-gray-800 font-semibold">
                    Parking & Vehicles
                </div>
                <p className="text-sm text-gray-500 mt-1 tracking-tight">
                    Monitor vehicle overstays, non-EV usage, and parking bay visibility.
                </p>
            </div>
            
            <CommonAlertTable tabs={vehicleTabs} />
        </div>
    );
}

export default Vehicles;
