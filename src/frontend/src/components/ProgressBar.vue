<template>
    <div
        class="progress ">
        <div
            :style="{width: `${pb}%`}"
            class="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            :aria-valuenow="pb"
            aria-valuemin="0"
            aria-valuemax="100">
            {{ pb.toFixed(2) }}%
        </div>
    </div>
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
