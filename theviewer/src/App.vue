<template>
  <div id="app">
    <Header @image-selected="updateSelectedImage" />
        <ImageCropper
      v-if="selectedImageSrc !== null"
      :key="selectedImageSrc"
      :src="selectedImageSrc"
      :imageNumber="selectedImageNumber"
    />
  </div>
</template>

<script>
  import Header from './components/HeaderOne.vue';
  import ImageCropper from "./components/ImageCropper.vue"
  export default{ 
      name:'app',
      components:{
        Header,
        ImageCropper,
      },
      data() {
    return {
      selectedImageSrc: null,
      selectedImageNumber: null,
    };
  },
      methods: {
    updateSelectedImage(imageNumber) {
      // Asigna la ruta de la imagen según el número seleccionado

      this.selectedImageSrc = `/logo${imageNumber}.jpg`;
      this.selectedImageNumber = imageNumber
      
    },
  },
  watch: {
    selectedImageSrc(newValue) {
      if (newValue !== null) {
        this.$nextTick(() => {
        });
      }
    },
    selectedImageNumber(newValue){
      if (newValue !== null) {
        this.$nextTick(() => {
    });
  }}}}

</script>

<style></style> 
