export default {
    async up() {
        return setTimeout(() => Promise.resolve(), 1500);
        // return Promise.resolve();
    },
    async down() {

        return Promise.resolve();
    }
};
