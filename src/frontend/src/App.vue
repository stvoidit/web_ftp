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
                        v-for="(v, index) in files"
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

import state from "./state";
export default {
    setup() {
        const {
            title,
            prevDir,
            files,
            listDownload,
            actionHandler,
            dragStart,
            drop,
            totalDownloadSize
        } = state();

        return {
            title,
            prevDir,
            files,
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
