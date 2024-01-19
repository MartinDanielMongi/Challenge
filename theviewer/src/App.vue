<template>
  <div id="app">
    <Header @image-selected="updateSelectedImage" />
    <div v-if="loading" class="preloader">
      <div class="spinner"></div>
    </div>
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
      loading: false,
    };
  },
      methods: {
      async updateSelectedImage(imageNumber) {
        this.loading = true;
        const request = await fetch('http://localhost:3000/images/' + imageNumber);
        const response = await request.json();
      // Asigna la ruta de la imagen según el número seleccionado

      this.selectedImageSrc = "data:image/jpeg;base64,"+ response.image;
      this.selectedImageNumber = imageNumber
      this.loading = false;
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

<style>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3498db; /* Cambia el color del spinner según tus preferencias */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}</style> 
