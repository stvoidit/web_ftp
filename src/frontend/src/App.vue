<template>
    <div class="container-fluid">
        <h4>{{ prevDir }}</h4>

        <div class="btn-group-vertical">
            <button
                class="btn btn-info block mb-1"
                @click="getDirHandler({path: prevDir, name:'..', isDir: true})">
                ...
            </button>
            <button
                v-for="v in values"
                :key="v.name"
                :class="{'btn-primary': v.isDir}"
                class="btn btn-sm block mb-1"
                @click="getDirHandler(v)">
                {{ v.name }}
                {{ v.size }}
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

        function getDirHandler (obj) {
            // cd or download
            let responseType ;
            if (!obj.isDir) {
                responseType = "blob";
            }

            api.post("/fs", obj, {responseType: responseType}).then(res => {
                if (res.headers["x-suggested-filename"]) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", res.headers["x-suggested-filename"]);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } else {
                    values.value = res.data.values;
                    prevDir.value = res.data.prevPath;
                }

            });
        }


        return {
            title,
            prevDir,
            values,
            getDirHandler
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
