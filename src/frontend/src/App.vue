<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <h4>{{ prevDir }}</h4>
                <div class="btn-group-vertical">
                    <button
                        class="btn btn-info btn-sm block mb-1"
                        @click="actionHandler({path: prevDir, name:'..', isDir: true})">
                        ...
                    </button>
                    <button
                        v-for="(v, index) in values"
                        :id="index"
                        :key="v.name"
                        draggable="true"
                        :class="{'btn-primary': v.isDir, 'btn-outline-dark': !v.isDir}"
                        class="btn btn-sm block mb-1"
                        @dragstart="dragStart"
                        @click="actionHandler(v)">
                        {{ v.name }}
                        <template v-if="v.hrSize">
                            [{{ v.hrSize }}]
                            <div
                                v-if="v.downloadProgress"
                                class="progress">
                                <div
                                    :style="{width: `${v.downloadProgress}%`}"
                                    class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                                    role="progressbar"
                                    :aria-valuenow="v.downloadProgress"
                                    aria-valuemin="0"
                                    aria-valuemax="100" />
                            </div>
                        </template>
                    </button>
                </div>
            </div>
            <div class="col">
                <div class="sticky-col">
                    <h4>список скачивания</h4>
                    <div
                        class="droptarget"
                        @dragover="(event) => {
                            event.preventDefault();
                        }"
                        @drop="drop">
                        <div
                            v-for="d in listDownload"
                            :key="d.name">
                            {{ `${d.path}/${d.name }` }}
                        </div>
                    </div>
                    <p>total: {{ totalDownloadSize }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref,computed } from 'vue';
import axios from "axios";
export default {
    setup() {
        const title = ref("referf");
        const prevDir = ref("");
        const api = axios.create();
        let values = ref([]);
        let listDownload = ref([]);

        api.get("/fs").then(res => {
            prevDir.value = res.data.prevPath;
            values.value = res.data.values.map(e => {
                if (!e.isDir) {
                    e.downloadProgress = 0.0;
                }
                return e;
            });
        });

        const downloadFile = (obj) => {
            // if file do download
            const downloadAPI = axios.create({
                onDownloadProgress:(eventdownload) => {
                    obj.downloadProgress = (eventdownload.loaded / eventdownload.total) * 100.;
                }
            });
            downloadAPI.post("/fs", obj, {responseType: "blob"}).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", obj.name);
                document.body.appendChild(link);
                link.click();
                link.remove();
                obj.downloadProgress = 0.0;
            });
        };

        const getDir = (obj) => {
            // if dir fetch includes
            api.post("/fs", obj).then(res => {
                values.value = res.data.values;
                prevDir.value = res.data.prevPath;
            });
        };

        const actionHandler = (obj) => {
            // cd or download
            if (obj.isDir) {
                getDir(obj);
            } else {
                downloadFile(obj);
            }
        };

        const dragStart = (event) => {
            event.dataTransfer.setData("FileIndex", event.target.id);
        };
        const drop = (event) => {
            event.preventDefault();
            let dataIndex = event.dataTransfer.getData("FileIndex");
            listDownload.value.push(values.value[dataIndex]);
        };
        const totalDownloadSize = computed(() => {
            let totalSize = 0;
            listDownload.value.forEach(e => {
                totalSize+=e.size;
            });
            return totalSize;
        });
        return {
            title,
            prevDir,
            values,
            actionHandler,
            listDownload,
            dragStart,
            drop,
            totalDownloadSize
        };
    }
};
</script>
<style src="bootstrap/dist/css/bootstrap.min.css"></style>
<style scoped>
.block {
    border-radius: 0 !important;
    text-align: left !important;
}
.droptarget {

    float: left;
    width: 100%;
    min-height: 200px;
    padding: 10px;
    border: 1px solid #aaaaaa;
}
.sticky-col {
    position: sticky;
    top: 2%;
}
</style>
