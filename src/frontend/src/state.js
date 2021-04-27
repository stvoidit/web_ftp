import { ref, computed } from 'vue';
import axios from "axios";

const api = axios.create();

function catchError(error) {
    let msg;
    if (error.response) {
        msg = error.response.data.error;
    } else {
        msg = error;
    }
    alert(msg);
}
function downloadFile(obj = Object) {
    // if file do download
    const downloadClient = axios.create({
        onDownloadProgress: (eventdownload) => {
            obj.downloadProgress = (eventdownload.loaded / eventdownload.total) * 100.;
        }
    });
    return downloadClient.post("/fs", obj, { responseType: "blob" }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", obj.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        obj.downloadProgress = 0.0;
        return new Promise((resolve) => {
            resolve("OK!");
        });
    }).catch(catchError);
}

const title = ref("referf");
const prevDir = ref("");
const files = ref([]);
const listDownload = ref([]);
const totalDownloadSize = computed(() => {
    const Mb = 1048576;
    const Gb = 1073741824;
    let totalSize = 0;
    listDownload.value.forEach(e => {
        totalSize += e.size;
    });
    let hSize = "";
    if (totalSize >= Mb && totalSize < Gb) {
        hSize = `${(totalSize / Mb).toFixed(2)}Mb`;
    } else if (totalSize >= Gb) {
        hSize = `${(totalSize / Gb).toFixed(2)}Gb`;
    } else {
        hSize = `${totalSize}b`;
    }
    return hSize;
});

function removeFromListDownload(obj) {
    listDownload.value = listDownload.value.filter((e) => { return e != obj; });
}
function getDir(obj) {
    // if dir fetch includes
    api.post("/fs", obj).then(res => {
        prevDir.value = res.data.prevPath;
        files.value = res.data.files.map(e => {
            if (!e.isDir) {
                e.downloadProgress = 0.0;
            }
            return e;
        });
    }).catch(catchError);
}
function actionHandler(obj = Object) {
    // cd or download
    if (obj.isDir) {
        getDir(obj);
    } else {
        downloadFile(obj);
    }
}
function dragStart(event) {
    event.dataTransfer.setData("FileIndex", event.target.id);
}
function drop(event) {
    event.preventDefault();
    let dataIndex = event.dataTransfer.getData("FileIndex");
    listDownload.value.push(files.value[dataIndex]);
}

getDir();
export default {
    title,
    prevDir,
    files,
    listDownload,
    actionHandler,
    downloadFile,
    dragStart,
    drop,
    totalDownloadSize,
    removeFromListDownload
};
