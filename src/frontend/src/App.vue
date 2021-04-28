<template>
    <div class="container is-fluid mt-3">
        <div class="columns">
            <div class="column">
                <FilesNavigate />
            </div>
            <div class="column">
                <DragAndDropList />
            </div>
        </div>
    </div>
</template>

<script>
import DragAndDropList from "./components/DragAndDropList";
import FilesNavigate from "./components/FilesNavigate";
export default {
    components: { DragAndDropList, FilesNavigate },
    setup() {
        document.title = "web FTP";
    }
};
</script>

<style src="bulma/css/bulma.min.css"></style>
