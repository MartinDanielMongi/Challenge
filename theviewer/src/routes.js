import { createRouter, createWebHistory } from "vue-router";
import ImageCropper from "./components/ImageCropper.vue";

const routes=[{
    name:'ImageCropper',
    component: ImageCropper,
    path:'/'
},
];
const router=createRouter({
    history: createWebHistory(),
    routes
});

export default router;