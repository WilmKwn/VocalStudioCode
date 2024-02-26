import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';

import Folder from './components/Folder';
import useEditData from './components/useEditData';
import useSpeechToText from './components/useSpeechToText';

import wordsToNumbers from 'words-to-numbers';

function App() {
  const [data, setData] = useState({
    name: "root",
    id: "0",
    type: "folder",
    items: [
      {
        name: "file1.txt",
        id: "1",
        type: "file",
        config: "2",
        items: []
      },
      {
        name: "file2.txt",
        id: "2",
        type: "file",
        config: "3",
        items: []
      },
    ]
  });
  const [curr, setCurr] = useState({name: '', id: ''});
  const [mapping, setMapping] = useState({});

  const { insertData, updateConfig, getMapping } = useEditData();

  const {text, start, stop} = useSpeechToText();

  useEffect(() => {
    const cleaned = text.trim().split()[0];

    const num = `${wordsToNumbers(cleaned)}`;
    if (num in mapping) {
      setCurr({name: "speech", id: mapping[num]});
    }
  }, [text]);

  useEffect(() => {
    const newMapping = getMapping(data);
    setMapping(newMapping);
  }, [data]);

  useEffect(() => {
    start();
    return () => {
      stop();
    }
  }, []);

  const createNew = (folderId, name, type) => {
    const newData = insertData(data, folderId, name, type);
    setData(newData);
  }
  const configNew = (fileId, num) => {
    const newData = updateConfig(data, fileId, num);
    setData(newData);
  }
  const selectFile = (fileId, name) => {
    setCurr({name: name, id: fileId});
  }

  const fileTypeFromName = (name) => {
    if (name.indexOf('.') > -1) {
      const type = name.substring(name.indexOf('.')+1);
      switch (type) {
        case 'py':
          return 'python';
        case 'js':
          return 'javascript';
        default:
          return 'text';
      }
    }
    return 'none';
  }

  return (
    <div className="w-full h-screen flex">

      <div className='m-1 w-1/3 border-2 border-black bg-gray-100'>
        <div className='flex justify-center border-b-2 border-black'>
          <p className='text-lg'>Browser</p>
          <button onClick={() => start()}>START</button>
        </div>
        <Folder current={curr.id} createNew={createNew} configNew={configNew} selectFile={selectFile} data={data} />
      </div>

      <div className='w-2/3 flex flex-col'>
        <p className='w-full text-2xl bg-gray-200'>Current: {curr.name}</p>
        {curr.id!=='' && <Editor path={curr.id} defaultLanguage={fileTypeFromName(curr.name)} className="m-1 border-2 border-black" theme="vs-dark" />}
      </div>

    </div>
  );
}

export default App;
