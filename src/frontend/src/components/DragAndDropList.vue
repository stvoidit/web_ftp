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
                    {{ `${file.path}/${file.name } [ ${file.hrSize} ]` }}
                </div>
                <div class="col mt-1">
                    <ProgressBar :progress-velue="file.downloadProgress" />
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
import ProgressBar from "./ProgressBar";
import state from "@/state";
export default {
    components: { ProgressBar },
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
