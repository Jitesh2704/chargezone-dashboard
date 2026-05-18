import React from 'react';
import { Flame, Ban, Snail, Trash2, Droplets, Lightbulb } from 'lucide-react';
import CommonAlertTable from '../components/Tables/CommonAlertTable';

const environmentTabs = [
    { 
        key: 'fire-smoke', 
        label: 'Fire & Smoke', 
        icon: <Flame size={18} />, 
        title: 'Fire & Smoke Detection',
        isResolvable: true 
    },
    { 
        key: 'smoking', 
        label: 'Smoking / Spitting', 
        icon: <Ban size={18} />, 
        title: 'Smoking & Spitting Detection',
        isResolvable: true 
    },
    { 
        key: 'animal', 
        label: 'Animal Movement', 
        icon: <Snail size={18} />, 
        title: 'Cattle / Animal Movement',
        isResolvable: true 
    },
    { 
        key: 'garbage', 
        label: 'Garbage & Debris', 
        icon: <Trash2 size={18} />, 
        title: 'Garbage & Debris Detection',
        isResolvable: true 
    },
    { 
        key: 'water', 
        label: 'Water Logging', 
        icon: <Droplets size={18} />, 
        title: 'Water Logging Detection',
        isResolvable: true 
    },
    { 
        key: 'lighting', 
        label: 'Canopy Lighting', 
        icon: <Lightbulb size={18} />, 
        title: 'Canopy Lighting Monitoring (8 PM - 4 AM)',
        isResolvable: true 
    },
];

function Environment() {
    return (
        <div className='w-full max-w-[1400px] mx-auto'>
            <div className="mb-6">
                <div className="text-xl xl:text-3xl tracking-tight text-gray-800 font-semibold">
                    Safety Operations
                </div>
                <p className="text-sm text-gray-500 mt-1 tracking-tight">
                    Monitor environmental hazards and station infrastructure safety.
                </p>
            </div>
            
            <CommonAlertTable tabs={environmentTabs} />
        </div>
    );
}

export default Environment;
