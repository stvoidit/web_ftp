<template>
    <progress
        class="progress is-info is-medium"
        :value="pb"
        max="100">
        {{ pb.toFixed(2) }}%
    </progress>
</template>

<script>
import {computed} from "vue";
export default {
    props: {
        progressVelue: { type: Number, default: 0.0 }
    },
    setup(props) {
        const pb = computed({
            get: () => props.progressVelue
        });
        return {
            pb
        };
    }
};
</script>
