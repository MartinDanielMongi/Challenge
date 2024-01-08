<template>
    <header>
      <div class="header-buttons">
        <button @click="showImage(1)">Imagen 1</button>
        <button @click="showImage(2)">Imagen 2</button>
        <button @click="showImage(3)">Imagen 3</button>
      </div>
      </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedImage: null,
      };
    },
    methods: {
      showImage(imageNumber) {
        this.selectedImage = imageNumber;
        this.$emit('image-selected', imageNumber);
      },
    },
  };
  </script>
  
  <style scoped>
  header {
    background-color: #333;
    color: #fff;
    padding: 15px;
    text-align: center;
  }
  
  .header-buttons button {
    margin-right: 10px;
    padding: 8px 12px;
    font-size: 14px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  </style>