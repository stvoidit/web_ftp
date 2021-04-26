<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <FilesNavigate />
            </div>
            <div class="col">
                <DragAndDropList />
            </div>
        </div>
    </div>
</template>

<script>
import DragAndDropList from "./components/DragAndDropList";
import FilesNavigate from "./components/FilesNavigate";
export default {
    components: { DragAndDropList, FilesNavigate }
};
</script>
<style src="bootstrap/dist/css/bootstrap.min.css"></style>
<style >
.block {
    border-radius: 0 !important;
    text-align: left !important;
}
</style>
