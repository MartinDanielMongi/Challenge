<template>
    <header>
      <div class="header-buttons">
        <button v-for="button in buttons" :key="button.id" @click="showImage(button.id)" >Image {{ button.id }}</button>
      </div>
      </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedImage: null,
        buttons: [],
      };
    },
    created() {fetch('http://localhost:3000/images')
      .then(response => response.json())
      .then(data => {
      this.buttons = data.images;
    })
      .catch(error => {
        console.error('Error fetching data:', error);
    });
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