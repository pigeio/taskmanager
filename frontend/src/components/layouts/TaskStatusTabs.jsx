import React from 'react'

const TaskStatusTabs = ({tabs ,  activeTab , setActivetab}) => {
  return <div className='my-2'>
    <div className='flex'>
        {tabs.map((tab) =>(
            <button
            key={tab.label}
            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
                activeTab === tab.label
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`}
            onClick={() => setActivetab(tab.label)}
            >
                <div className='flex items-center'>
                    <span className='text-xs'>{tab.label}</span>
                    <span
                    className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                    activeTab === tab.label
                    ? 'bg-primary text-white'
                    : 'bg-gray-200/70 text-gray-600'}`}
                    >
                        {tab.count}
                    </span>
                </div>
                {activeTab === tab.label && (
                    <div className='absolute bottom-0 lext-0 w-full h-0.5 bg-primary'></div>
                )}
            </button>
        ))}
    </div>
  </div>
}

export default TaskStatusTabs;
