<template>
    <div class="sticky-col">
        <h4>список скачивания</h4>
        <div
            class="droptarget container mb-2"
            @dragover="(event) => {
                event.preventDefault();
            }"
            @drop="drop">
            <div
                v-for="d in listDownload"
                :key="d.name"
                class="mr-1 mb-1 row text-left">
                <div class="col-auto">
                    {{ `${d.path}/${d.name }` }}
                </div>
                <div
                    class="progress col mt-1">
                    <div
                        :style="{width: `${d.downloadProgress}%`}"
                        class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        role="progressbar"
                        :aria-valuenow="d.downloadProgress"
                        aria-valuemin="0"
                        aria-valuemax="100" />
                </div>
            </div>
        </div>

        <div>
            total: {{ totalDownloadSize }} <button
                v-show="listDownload.length"
                class="btn btn-sm block btn-primary"
                @click="DownloadFiles">
                download
            </button>
        </div>
    </div>
</template>

<script>
import state from "@/state";
export default {
    setup() {
        const {
            listDownload,
            drop,
            totalDownloadSize,
            downloadFile,
            removeFromListDownload
        } = state;

        function DownloadFiles() {
            listDownload.value.forEach(e => {
                downloadFile(e).then(() => {
                    removeFromListDownload(e);
                });
            });

        }
        return {
            listDownload,
            drop,
            totalDownloadSize,
            downloadFile,
            DownloadFiles
        };
    }
};
</script>

<style>
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
