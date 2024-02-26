import { v4 } from "uuid";

const useEditData = () => {
    function insertData(data, folderId, name, type) {
        if (data.id === folderId) {
            if (type === 'file') {
                data.items.unshift({
                    name: name,
                    id: v4(),
                    config: '',
                    type: 'file',
                    items: [],
                });
            } else {
                data.items.unshift({
                    name: name,
                    id: v4(),
                    type: 'folder',
                    items: [],
                });
            }

            return data;
        }
        const newData = data.items.map((item) => {
            return insertData(item, folderId, name, type);
        });
        return {...data, items: newData};
    }

    function updateConfig(data, fileId, num) {
        if (data.id === fileId) {
            return {...data, config: num};
        }
        const newData = data.items.map((item) => {
            return updateConfig(item, fileId, num);
        });
        return {...data, items: newData};
    }

    function getNameFromId(data, fileId) {
        if (data.id === fileId) {
            return data.name;
        }

        let output = null;
        data.items.forEach((item) => {
            const o = getNameFromId(item, fileId);
            if (o) output = o;
        });
        return output;
    }

    let mapping = {};
    function traverseConfig(data) {
        if (data.type === 'file') {
            mapping[data.config] = data.id;
        }
        data.items.map((item) => {
            return getMapping(item);
        });
    }
    function getMapping(data) {
        traverseConfig(data);
        return mapping;
    }

    return {insertData, updateConfig, getMapping, getNameFromId};
}

export default useEditData;