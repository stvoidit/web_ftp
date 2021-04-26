<template>
    <div class="container-fluid">
        <h4>{{ prevDir }}</h4>
        <div class="btn-group-vertical">
            <button
                class="btn btn-info block mb-1"
                @click="actionHandler({path: prevDir, name:'..', isDir: true})">
                ...
            </button>
            <button
                v-for="v in values"
                :key="v.name"
                :class="{'btn-primary': v.isDir}"
                class="btn btn-sm block mb-1"
                @click="actionHandler(v)">
                {{ v.name }}
                <template v-if="v.size">
                    [{{ v.size }}]
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
            values.value = res.data.values;
            prevDir.value = res.data.prevPath;
        });

        function downloadFile(obj) {
            // if file do download
            api.post("/fs", obj, {responseType: "blob"}).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", res.headers["x-suggested-filename"]);
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        }

        function getDir(obj) {
            // if dir fetch includes
            api.post("/fs", obj).then(res => {
                values.value = res.data.values;
                prevDir.value = res.data.prevPath;
            });
        }

        function actionHandler (obj) {
            // cd or download
            if (obj.isDir) {
                getDir(obj);
            } else {
                downloadFile(obj);
            }
        }
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
