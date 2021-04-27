<template>
    <h4>{{ prevDir }}</h4>
    <div class="btn-group-vertical">
        <button
            class="btn btn-info btn-sm block mb-1"
            @click="actionHandler({path: prevDir, name:'..', isDir: true})">
            ...
        </button>
        <button
            v-for="(file, index) in files"
            :id="index"
            :key="file.name"
            draggable="true"
            :class="{'btn-primary': file.isDir, 'btn-outline-dark': !file.isDir}"
            class="btn btn-sm block mb-1"
            @dragstart="dragStart"
            @click="actionHandler(file)">
            {{ file.name }}
            <template v-if="file.hrSize">
                [{{ file.hrSize }}]
                <ProgressBar
                    v-if="file.downloadProgress"
                    :progress-velue="file.downloadProgress" />
            </template>
        </button>
    </div>
</template>

<script>
import ProgressBar from "./ProgressBar";
import state from "@/state";
export default {
    components: { ProgressBar },
    setup() {
        const {
            title,
            prevDir,
            files,
            actionHandler,
            dragStart
        } = state;

        return {
            title,
            prevDir,
            files,
            actionHandler,
            dragStart
        };
    }
};
</script>
