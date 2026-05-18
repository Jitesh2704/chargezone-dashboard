import React from 'react';
import { Wrench, AlertTriangle, Scissors, ArrowRightLeft } from 'lucide-react';
import CommonAlertTable from '../components/Tables/CommonAlertTable';

const operationTabs = [
    { 
        key: 'gun-boot', 
        label: 'Gun Not in Boot', 
        icon: <Wrench size={18} />, 
        title: 'Charging Gun Not Placed in Boot',
        isResolvable: true 
    },
    { 
        key: 'sop-violation', 
        label: 'SOP Violation', 
        icon: <AlertTriangle size={18} />, 
        title: 'SOP Violation During Charging',
        isResolvable: true 
    },
    { 
        key: 'gun-cut', 
        label: 'Sharp Object / Gun Cut', 
        icon: <Scissors size={18} />, 
        title: 'Cutting of Charging Gun / Sharp Object',
        isResolvable: true 
    },
    { 
        key: 'gun-twice', 
        label: 'Multiple Gun Insertions', 
        icon: <ArrowRightLeft size={18} />, 
        title: 'Putting the Gun Twice or Thrice',
        isResolvable: true 
    },
];

function Operations() {
    return (
        <div className='w-full max-w-[1400px] mx-auto'>
            <div className="mb-6">
                <div className="text-xl xl:text-3xl tracking-tight text-gray-800 font-semibold">
                    Charger Monitoring
                </div>
                <p className="text-sm text-gray-500 mt-1 tracking-tight">
                    Monitor operational violations and equipment tampering logs.
                </p>
            </div>
            
            <CommonAlertTable tabs={operationTabs} />
        </div>
    );
}

export default Operations;
