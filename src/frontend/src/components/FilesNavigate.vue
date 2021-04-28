<template>
    <article class="panel is-link">
        <p class="panel-heading">
            {{ prevDir }}
        </p>
        <a
            class="panel-block has-background-primary-light"
            @click="actionHandler({path: prevDir, name:'..', isDir: true})">
            <span class="panel-icon">
                <i
                    class="fas fa-book"
                    aria-hidden="true" />
            </span>
            ...
        </a>
        <a
            v-for="(file, index) in files"
            :id="index"
            :key="file.name"
            class="panel-block"
            :class="{'has-background-info-light': file.isDir}"
            draggable="true"
            @dragstart="dragStart"
            @click="actionHandler(file)">
            <span class="panel-icon">
                <i
                    class="fas fa-book"
                    aria-hidden="true" />
            </span>
            {{ file.name }}
            <template v-if="file.hrSize">
                [{{ file.hrSize }}]
                <ProgressBar
                    v-if="file.downloadProgress"
                    :progress-velue="file.downloadProgress" />
            </template>
        </a>
    </article>
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
