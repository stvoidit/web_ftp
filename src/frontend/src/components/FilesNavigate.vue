<template>
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
</template>

<script>
import state from "@/state";
export default {
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
