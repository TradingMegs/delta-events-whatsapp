import React from 'react';

export default function SharedView() {
    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">SharedView</h1>
            <p className="text-gray-400">
                Route: /shared/:token <br/>
                Status: Recovered Placeholder
            </p>
        </div>
    );
};
