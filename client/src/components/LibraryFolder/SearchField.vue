<template>
    <b-input-group size="sm">
        <b-form-input
            v-model="search"
            class="mr-1"
            type="search"
            id="filterInput"
            placeholder="Search"
            @keyup.enter="startSearch()"
        />
    </b-input-group>
</template>

<script>
export default {
    name: "SearchField",
    data() {
        return {
            search: "",
            awaitingSearch: false,
        };
    },
    methods: {
        startSearch() {
            this.$emit("updateSearch", this.search);
            this.awaitingSearch = false;
        },
    },
    watch: {
        search: function () {
            if (!this.awaitingSearch) {
                setTimeout(() => {
                    this.startSearch();
                }, 1000); // 1 sec delay
            }
            this.awaitingSearch = true;
        },
    },
};
</script>

<style scoped></style>
