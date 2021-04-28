<template>
    <div class="sticky-col">
        <div class="mb-1">
            <b>download list  total:</b> {{ totalDownloadSize }}
            <button
                v-show="listDownload.length"
                class="button is-small is-success"
                @click="DownloadFiles">
                download
            </button>
        </div>
        <div
            class="droptarget mb-2 box"
            @dragover="(event) => {event.preventDefault();}"
            @drop="drop">
            <table class="table is-fullwidth">
                <tbody>
                    <tr
                        v-for="file in listDownload"
                        :key="file.name">
                        <td scope="row">
                            <button
                                class="button is-danger is-small"
                                @click="removeFromListDownload(file)">
                                x
                            </button>
                        </td>
                        <td> {{ `${file.path}/${file.name }` }}</td>
                        <td> {{ file.hrSize }}</td>
                        <td width="40%;">
                            <ProgressBar :progress-velue="file.downloadProgress" />
                        </td>
                    </tr>
                </tbody>
            </table>
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
