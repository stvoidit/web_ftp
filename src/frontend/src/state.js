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
    downloadClient.post("/fs", obj, { responseType: "blob" }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", obj.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        obj.downloadProgress = 0.0;
    }).catch(catchError);
}
export default () => {
    const title = ref("referf");
    const prevDir = ref("");
    const files = ref([]);
    const listDownload = ref([]);
    const totalDownloadSize = computed(() => {
        let totalSize = 0;
        listDownload.value.forEach(e => {
            totalSize += e.size;
        });
        return totalSize;
    });
    api.get("/fs").then(res => {
        prevDir.value = res.data.prevPath;
        files.value = res.data.files.map(e => {
            if (!e.isDir) {
                e.downloadProgress = 0.0;
            }
            return e;
        });
    });

    function getDir(obj = Object) {
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

    return {
        title,
        prevDir,
        files,
        listDownload,
        actionHandler,
        dragStart,
        drop,
        totalDownloadSize
    };
};
