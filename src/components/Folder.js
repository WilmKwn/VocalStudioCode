import React, { useState } from 'react'

const Folder = ({current, createNew, configNew, selectFile, data}) => {
    const [expand, setExpand] = useState(true);

    const [create, setCreate] = useState({clicked: false, type: ''});
    const [name, setName] = useState('');

    const [config, setConfig] = useState(false);
    const [num, setNum] = useState('');

    const createNewFile = () => {
        setCreate({clicked: true, type: 'file'});
    }
    const createNewFolder = () => {
        setCreate({clicked: true, type: 'folder'});

    }

    const cancelCreate = () => {
        setName('');
        setCreate({...create, clicked: false});
    }

    const enterCreate = (e) => {
        if (e.key === "Enter" && name) {
            createNew(data.id, name, create.type);
            setCreate({...create, clicked: false});
        }
    }

    const cancelConfig = () => {
        setConfig(false);
        setNum('');
    }
    const enterConfig = (e, fileId) => {
        if (e.key === "Enter") {
            if (e.target.value==='' || Number.isInteger(parseInt(e.target.value))) {
                configNew(fileId, e.target.value);
                setConfig(false);
            }
        }
    }

    if (data.type === "folder") {
        return (
            <div className='w-full select-none'>
                <div className='w-full flex border-b-2 border-l-2 border-gray-400'>
                    <p className='text-lg cursor-default w-full' onClick={() => setExpand(!expand)}>📁{data.name}</p>
                    {(expand || data.items.length===0) && <div className='flex'>
                        <button onClick={() => createNewFile()} className='bg-white border-2 border-black mr-1'>+📄</button>
                        <button onClick={() => createNewFolder()} className='bg-white border-2 border-black'>+📁</button>
                    </div>}
                </div>
                {create.clicked && (
                    <div className='pl-10 flex'>
                        <p className='text-lg border-l-2 border-gray-400'>{create.type==='file' ? '📄' : '📁'}</p>
                        <input type='text' onChange={(e) => setName(e.target.value)} autoFocus onBlur={() => cancelCreate()} onKeyDown={(e) => enterCreate(e)} />
                        <button  className='hidden'></button>
                    </div>
                )}
                <div className={`pl-10 cursor-pointer ${!expand && 'hidden'}`}>
                    {data.items.map((item, index) => (
                        <Folder current={current} createNew={createNew} configNew={configNew} selectFile={selectFile} key={index} data={item} />
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div className={`flex w-full border-b-2 border-l-2 border-gray-400 ${current===data.id && 'bg-gray-300'}`}>
                <p onClick={() => selectFile(data.id, data.name)} className='text-lg w-full'>📄{data.name}</p>
                {config ?
                    <div className='w-10'>
                        <input className='w-full text-center' type='text' onChange={(e) => setNum(e.target.value)} autoFocus onBlur={() => cancelConfig()} onKeyDown={(e) => enterConfig(e, data.id)} />
                        <button  className='hidden'></button>
                    </div>
                    :
                    <p onClick={() => setConfig(true)} className='pl-1 pr-1 border-2 border-black'>{data.config==='' ? '🔲' : data.config}</p>
                }
            </div>
        );
    }
}

export default Folder
