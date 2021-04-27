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
                v-for="file in listDownload"
                :key="file.name"
                class="mr-1 mb-1 row text-left">
                <div class="col-auto">
                    <button
                        class="btn btn-sm btn-danger block"
                        @click="removeFromListDownload(file)">
                        x
                    </button>
                </div>
                <div class="col-5">
                    {{ `${file.path}/${file.name }` }}
                </div>
                <div class="col mt-1">
                    <div
                        class="progress ">
                        <div
                            :style="{width: `${file.downloadProgress}%`}"
                            class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                            role="progressbar"
                            :aria-valuenow="file.downloadProgress"
                            aria-valuemin="0"
                            aria-valuemax="100">
                            {{ file.downloadProgress.toFixed(2) }}%
                        </div>
                    </div>
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
            DownloadFiles,
            removeFromListDownload
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
