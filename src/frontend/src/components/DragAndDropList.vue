<template>
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
</template>

<script>
import state from "@/state";
export default {
    setup() {
        const {
            listDownload,
            drop,
            totalDownloadSize
        } = state;

        return {
            listDownload,
            drop,
            totalDownloadSize
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
