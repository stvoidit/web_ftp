<template>
    <div class="container-fluid">
        <h4>{{ prevDir }}</h4>
        <div class="btn-group-vertical">
            <button
                class="btn btn-info btn-sm block mb-1"
                @click="actionHandler({path: prevDir, name:'..', isDir: true})">
                ...
            </button>
            <button
                v-for="v in values"
                :key="v.name"
                :class="{'btn-primary': v.isDir, 'btn-outline-dark': !v.isDir}"
                class="btn btn-sm block mb-1"
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
</template>

<script>

import { ref } from 'vue';
import axios from "axios";
export default {
    setup() {
        const title = ref("referf");
        const prevDir = ref("");
        const api = axios.create();
        let values = ref([]);

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
        return {
            title,
            prevDir,
            values,
            actionHandler
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
</style>
